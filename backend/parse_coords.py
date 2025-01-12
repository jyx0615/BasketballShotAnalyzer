import pickle, os

from draw import draw_release_frame, draw_lowest_frame

# get the frame where the hand is the highese(smallest y coordinate)
def get_release_frame(landmark_list, useLeft = False):
    if not useLeft:
        handCoords = [(i, item['hand'][1]) for i, item in enumerate(landmark_list) if 'hand' in item]
    else:
        handCoords = [(i, item['leftHand'][1]) for i, item in enumerate(landmark_list) if 'leftHand' in item]
    
    return min(handCoords, key=lambda x: x[1])[0] if handCoords else None


# get the first frame where the knee angle is less than the threshold 
def get_squat_frame(landmark_list, useLeft = False, kneeAngleThreshold = 130):
    if not useLeft:
        return next((i for i, entry in enumerate(landmark_list) if entry.get('kneeAngle', float('inf')) < kneeAngleThreshold), None)
    else:
        return next((i for i, entry in enumerate(landmark_list) if entry.get('leftKneeAngle', float('inf')) < kneeAngleThreshold), None)


# get the squat(start) and release(end) frame
def get_key_frames(landmark_list, useLeft = False, kneeAngleThreshold = 130, isPrint = False):
    release = get_release_frame(landmark_list, useLeft)
    squat = get_squat_frame(landmark_list, useLeft, kneeAngleThreshold)

    if isPrint:
        print("squat at frame", squat)
        print("release at frame", release)
        print("key point1 (release)", landmark_list[release]['hand'])
        print("key point2 (ankle)",  landmark_list[squat]['ankle'])

    return squat, release


def get_min_angle_from_coords(coord, key):
    filtered_coords = [(i, item[key]) for i, item in enumerate(coord) if key in item]
    return min(filtered_coords, key=lambda x: x[1])[1] if filtered_coords else None


# get some key points from the video
def get_key_points(video_path, coord_path, fps, index=None, show_result = False):
    # load the coordinates
    with open(coord_path, 'rb') as f:
        coord = pickle.load(f)

    print("analyzing", video_path, "\n")
    squat, release = get_key_frames(coord, useLeft=True, kneeAngleThreshold=140)
    min_elbow_angle = get_min_angle_from_coords(coord[squat:release], 'elbowAngle')
    min_knee_angle = get_min_angle_from_coords(coord[squat:release], 'leftKneeAngle')

    # get the frame number where the left hip has the lowest y-coordinate
    filtered_coords = [item for item in coord if 'leftHip' in item]
    # get the index of the frame where the left hip has the lowest y-coordinate
    lowest = max(range(len(filtered_coords)), key=lambda i: filtered_coords[i]['leftHip'][1])
    
    
    folder_path = os.path.dirname(video_path)
    output_image_path = os.path.join(folder_path, f"release{index}.jpg")
    draw_release_frame(video_path, release, coord[release], save=True, filename=output_image_path)
    output_image_path = os.path.join(folder_path, f"squat{index}.jpg")
    draw_lowest_frame(video_path, lowest, coord[lowest], save=True, filename=os.path.join(folder_path, f"lowest{index}.jpg"))

    keypoints = {
        "release right elbow angle": coord[release]['elbowAngle'],
        "minimum elbow angle": min_elbow_angle,
        "minimum knee angle": min_knee_angle,
        "angle between hip, shoulder, elbow at release": coord[release]['handAngle'],
        "shooting duration": (release - squat) * fps,
        "descending duration": (lowest - squat) * fps,
        "ascending duration": (release - lowest) * fps
    }

    if show_result:
        for key, value in keypoints.items():
            print(f'{key}: {value}')
    
    return keypoints


# video_name = "shooting.mp4"
# get_key_points(video_name)