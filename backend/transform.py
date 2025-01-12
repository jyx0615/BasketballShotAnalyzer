import os

import cv2
import numpy as np
from moviepy.editor import VideoFileClip
from moviepy.editor import ImageSequenceClip
from cvzone.SelfiSegmentationModule import SelfiSegmentation
import pickle
from moviepy.video.fx.all import speedx
from moviepy.editor import clips_array

from utils import distance
from parse_coords import get_squat_frame, get_release_frame


# for background removing
segmentor = SelfiSegmentation()


# the angle between vector1 and vector2
def calculateAngle(v1, v2):
    cosine_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
    angle = np.arccos(cosine_angle)
    return np.degrees(angle)


def get_coord(point, width, height):
    return (int(point[0] * width), int(point[1] * height))


# resize the first video to let it have given height
def resize_to_same_height(video1_path, video2_path, show=False):
    directory_path = os.path.dirname(video1_path)
    cap1 = cv2.VideoCapture(video1_path)
    cap2 = cv2.VideoCapture(video2_path)
    target_height = int(cap2.get(cv2.CAP_PROP_FRAME_HEIGHT))

    width1 = int(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))
    height1 = int(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap1.get(cv2.CAP_PROP_FPS)

    scale_factor = target_height / height1
    new_width = int(width1 * scale_factor)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(os.path.join(directory_path,'resized_video.mp4'), fourcc, fps, (new_width, target_height))

    while cap1.isOpened():
        ret, frame1 = cap1.read()
        if not ret:
            break

        # Resize the frame to match the target width
        resized_frame = cv2.resize(frame1, (new_width, target_height), interpolation=cv2.INTER_LINEAR)

        out.write(resized_frame)

        # Display the frame (optional)
        if(show):
            cv2.imshow('Resized to same height', resized_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap1.release()
    out.release()
    cv2.destroyAllWindows()
    return scale_factor, new_width


# pad the video to have given width
def pad_to_same_width(video, target_width, show=False):
    directory_path = os.path.dirname(video)
    cap = cv2.VideoCapture(video)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(os.path.join(directory_path, 'padded_video.mp4'), fourcc, fps, (target_width, height))

    padded_frame = np.zeros((height, target_width, 3), dtype=np.uint8)
    x_pad = (target_width - width) // 2

    while cap.isOpened():
        ret, frame1 = cap.read()
        if not ret:
            break

        # Place the zoomed-out frame onto the padded frame
        padded_frame[:, x_pad:x_pad+width] = frame1

        out.write(padded_frame)

        if(show):
            cv2.imshow('Pad to same width', padded_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    # Release all resources
    cap.release()
    out.release()
    cv2.destroyAllWindows()
    return x_pad


# Apply the transformation to each frame of the first video
def apply_transformation(frame, transformation_matrix, w, h):
    transformed_frame = cv2.warpAffine(frame, transformation_matrix, (w, h))
    return transformed_frame


# transform the first video to map the points in the second video
def transform_video(video, scaling_factor, point1_video1, point2_video1, point1_video2, point2_video2):
    directory_path = os.path.dirname(video)
    clip = VideoFileClip(video)
    width, height = clip.size
    fps = clip.fps
    # scaling
    point1 = point1_video1 * scaling_factor
    point2 = point2_video1 * scaling_factor

    # movement
    delta_x = point1_video2[0] - point1[0]
    delta_y = point1_video2[1] - point1[1]
    transformation_matrix = np.float32([[scaling_factor, 0, delta_x], [0, scaling_factor, delta_y]])
    point2[0] += delta_x
    point2[1] += delta_y

    # rotation
    v1 = point2 - point1
    v2 = point2_video2 - point1
    angle = calculateAngle(v1, v2)
    rotation_matrix = cv2.getRotationMatrix2D(point1, -angle, 1)

    combined_matrix = np.dot(rotation_matrix, np.vstack([transformation_matrix, [0, 0, 1]]))[:2]
    transformed_frames = [apply_transformation(frame, combined_matrix, width, height) for frame in clip.iter_frames()]

    transformed_clip = ImageSequenceClip(transformed_frames, fps=fps)
    transformed_clip.write_videofile(os.path.join(directory_path, "transformed_video.mp4"), codec="libx264")


def get_frame_at_index(cap, index):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(index))
    success, frame = cap.read()
    if success:
        return frame
    else:
        return None
    

# overlay two videos which has same shape
def overlay_videos(video1_path, video2_path, remove_bg = False, remove_bg_thershold = 0.3, show=False):
    directory_path = os.path.dirname(video1_path)
    cap1 = cv2.VideoCapture(video1_path)
    cap2 = cv2.VideoCapture(video2_path)

    # Get the properties of the videos
    width = int(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fps1 = cap1.get(cv2.CAP_PROP_FPS)
    fps2 = cap2.get(cv2.CAP_PROP_FPS)
    frame_count1 = cap1.get(cv2.CAP_PROP_FRAME_COUNT)
    frame_count2 = cap2.get(cv2.CAP_PROP_FRAME_COUNT)

    delta_f1 = fps1 / max(fps1, fps2)
    delta_f2 = fps2 / max(fps1, fps2)

    # Set up the VideoWriter to save the overlay video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(os.path.join(directory_path, 'overlay_video.mp4'), fourcc, max(fps1, fps2), (width, height))
    out2 = cv2.VideoWriter(os.path.join(directory_path, 'side.mp4'), fourcc, max(fps1, fps2), (2 * width, height))

    frame_idx1, frame_idx2 = 0, 0

    while frame_idx1 < frame_count1 or frame_idx2 < frame_count2:
        frame1 = get_frame_at_index(cap1, frame_idx1)
        frame2 = get_frame_at_index(cap2, frame_idx2)
        frame_idx1 += delta_f1
        frame_idx2 += delta_f2

        if frame1 is None or frame2 is None:
            break

        # remove the background of first video
        if remove_bg:
            frame2 = segmentor.removeBG(frame2, imgBg = (0, 0, 0), cutThreshold=remove_bg_thershold)

        # alpha => contrast, beta => lightning
        # frame1 = cv2.convertScaleAbs(frame1, alpha=0.7, beta=-30)

        # overlay frames (50% transparency for example)
        overlay_frame = cv2.addWeighted(frame1, 0.6, frame2, 0.7, 0)
        out.write(overlay_frame)

        combined_frame = np.hstack((frame1, frame2))
        out2.write(combined_frame)

        if show:
            cv2.imshow('Overlay videos', overlay_frame)
            cv2.imshow('Side by side videos', combined_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
    # Release all resources
    cap1.release()
    cap2.release()
    out.release()
    out2.release()
    cv2.destroyAllWindows()
    print("overlayp video saved to ", os.path.join(directory_path, 'overlay_video.mp4'))
    print("side by side video saved to ", os.path.join(directory_path, 'side.mp4'))


def get_video_width_height_fps(video_path):
    clip = VideoFileClip(video_path)
    width, height = clip.size
    return width, height


# get the start/ end frame and corresponding points in the video
def get_reference_from_video_name(coord_path, useLeft = True):
    # load the coordinates
    with open(coord_path, 'rb') as f:
        landmarks = pickle.load(f)

    release = get_release_frame(landmarks, useLeft)
    squat = get_squat_frame(landmarks, useLeft)
    if useLeft:
        return squat, release, landmarks[release]['leftHand'], landmarks[squat]['leftAnkle']
    else:
        return squat, release, landmarks[release]['hand'], landmarks[squat]['ankle']
        

# align start frame and end frame in two videos
def align_vidoes(video1_path, video2_path, start_frame1, end_frame1, start_frame2, end_frame2):
    directory_path = os.path.dirname(video1_path)
    # Load video clips
    clip1 = VideoFileClip(video1_path)
    clip2 = VideoFileClip(video2_path)

    # Calculate frame rates for each video
    fps1 = clip1.fps
    fps2 = clip2.fps

    # Convert frame counts to seconds (duration)
    duration1 = (end_frame1 - start_frame1) / fps1
    duration2 = (end_frame2 - start_frame2) / fps2

    # Determine target duration as the longer of the two durations
    target_duration = max(duration1, duration2)

    # Rescale each clip to match the target duration
    clip1_rescaled = speedx(clip1.subclip(start_frame1 / fps1, end_frame1 / fps1), duration1 / target_duration)
    clip2_rescaled = speedx(clip2.subclip(start_frame2 / fps2, end_frame2 / fps2), duration2 / target_duration)

    # save the videos
    final_clip = clips_array([[clip1_rescaled, clip2_rescaled]])
    final_path = os.path.join(directory_path, "aligned.mp4")
    final_clip.write_videofile(final_path, codec="libx264", verbose=False, logger=None)
    clip1_path = os.path.join(directory_path, "align1.mp4")
    clip1_rescaled.write_videofile(clip1_path, codec="libx264", verbose=False, logger=None)
    clip2_path = os.path.join(directory_path, "align2.mp4")
    clip2_rescaled.write_videofile(clip2_path, codec="libx264", verbose=False, logger=None)


def combine(video1_path, coord1_path, video2_path, coord2_path):
    directory_path = os.path.dirname(video1_path)
    # get the video shape
    width1, height1 = get_video_width_height_fps(video1_path)
    width2, height2 = get_video_width_height_fps(video2_path)
    # print("video1 shape", width1, height1)
    # print("video2 shape", width2, height2)

    squat1, release1, point1_video1, point2_video1 = get_reference_from_video_name(coord1_path)
    squat2, release2, point1_video2, point2_video2 = get_reference_from_video_name(coord2_path)

    # squat1 = 90
    # release1 = 134
    # squat2 -= 10
    # print(squat1, release1)

    # align two videos
    align_vidoes(video1_path, video2_path, squat1, release1, squat2, release2)
    video1_path = os.path.join(directory_path, "align1.mp4")
    video2_path = os.path.join(directory_path, "align2.mp4")

    # pad the video that has smaller width to have the same width as another
    if(width1 < width2):
        # print('pad video1 to width = ', width2)
        x_pad = pad_to_same_width(video1_path, width2)
        point1_video1[0] += x_pad
        point2_video1[0] += x_pad
        video1_path = os.path.join(directory_path, "padded_video.mp4")
    else:
        # print('pad video2 to width = ', width1)
        x_pad = pad_to_same_width(video2_path, width1)
        point1_video2[0] += x_pad
        point2_video2[0] += x_pad
        video2_path = os.path.join(directory_path, "padded_video.mp4")

    # transform the fist video to map the two points in second video
    scale_factor = distance(point1_video2, point2_video2) / distance(point1_video1, point2_video1)
    transform_video(video1_path, scale_factor, point1_video1, point2_video1, point1_video2, point2_video2)

    video1_path = os.path.join(directory_path, 'transformed_video.mp4')

    # print(video1_path, video2_path)
    overlay_videos(video1_path, video2_path)


# combine("curry.mp4", "shooting3.mp4")

# kd
# height 191,  181
# ankle 286, 1079

# shooting 3
# height 511 320
# ankle 589, 1741

# kt
# height 321, 155
# ankel 556, 759

# ak
# height 217, 153
# ankle 315, 714

# # # Points in the first video(point 1 = knee coord, point 2 = ankle coord)
# point1_video1 = np.array([    217,  153])
# point2_video1 = np.array([    315, 714])

# # point1_video1 = np.array([191,  181])
# # point2_video1 = np.array([286, 1079])

# # # Corresponding points in the second video
# point1_video2 = np.array([    511, 320])
# point2_video2 = np.array([    589, 1741])