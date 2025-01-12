import cv2

OUTPUT_FOLDER = 'output'
COORD_FOLDER = 'output/coords'
VIDEO_FOLDER = 'videos'


def get_frame_at_index(videoName, index):
    cap = cv2.VideoCapture(videoName)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(index))
    success, frame = cap.read()
    if success:
        return frame
    else:
        return None
    

def draw_circle(frame, coord, radius=5, color=(0, 0, 255), thickness=2):
    cv2.circle(frame, coord, radius, color, thickness)
    return frame


def save_subclip(video_path, start_frame, end_frame, output_path="output.mp4"):
    cap = cv2.VideoCapture(video_path)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(start_frame))
    # get the frame size and fps
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, 30, (frame_width, frame_height))
    for i in range(start_frame, end_frame):
        ret, frame = cap.read()
        cv2.putText(frame, str(i), (150, 150), cv2.FONT_HERSHEY_SIMPLEX, 4, (0, 0, 255), 4)
        if ret:
            out.write(frame)
    out.release()
    cap.release()


def draw_release_frame(video_path, release_frame, coord, save=True, filename="release.jpg", show=False):
    frame = get_frame_at_index(video_path, release_frame)
    draw_elbow_angle(frame, coord)
    # draw_hand_angle(frame, coord)

    # display the frame
    if show:
        cv2.imshow("release frame", frame)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    # save the file to have the same size as the original video
    if save:
        cv2.imwrite(filename, frame)


def draw_lowest_frame(video_path, lowest_frame, coord, save=True, filename="lowest.jpg", show=False):
    frame = get_frame_at_index(video_path, lowest_frame)
    draw_knee_angle(frame, coord)
    draw_elbow_angle(frame, coord)

    # display the frame
    if show:
        cv2.imshow("lowest frame", frame)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    # save the file to have the same size as the original video
    if save:
        cv2.imwrite(filename, frame)


def draw_elbow_angle(frame, coord):
    cv2.line(frame, coord['shoulder'], coord['elbow'], (0, 255, 0), 2)
    cv2.line(frame, coord['hand'], coord['elbow'], (0, 255, 0), 2)
    # set the text thinkness according to the frame size
    font_scale = frame.shape[0] / 300
    text_thickness = int(frame.shape[0] / 100)
    delta = int(frame.shape[0] / 20)
    cv2.putText(frame, f"{round(coord['elbowAngle'])}", (coord['elbow'][0] + delta, coord['elbow'][1] - delta), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 255), text_thickness)
    

def draw_knee_angle(frame, coord):
    cv2.line(frame, coord['ankle'], coord['knee'], (255, 0, 0), 2)
    cv2.line(frame, coord['knee'], coord['hip'], (255, 0, 0), 2)
    font_scale = frame.shape[0] / 300
    text_thickness = int(frame.shape[0] / 100)
    delta = int(frame.shape[0] / 20)
    cv2.putText(frame, f"{round(coord['kneeAngle'])}", (coord['knee'][0] + delta, coord['knee'][1] - delta), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 255), text_thickness)


def draw_hand_angle(frame, coord):
    cv2.line(frame, coord['elbow'] + (0,10), coord['shoulder'] + (0, 10), (255, 255, 0), 2)
    cv2.line(frame, coord['hip'], coord['shoulder'], (255, 255, 0), 2)
    font_scale = frame.shape[0] / 300
    text_thickness = int(frame.shape[0] / 100)
    delta = int(frame.shape[0] / 20)
    cv2.putText(frame, f"{round(coord['handAngle'])}", (coord['shoulder'][0] - delta, coord['shoulder'][1] + delta), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 255), text_thickness)


# video_name = "curry"
# video_path = os.path.join(VIDEO_FOLDER, f"{video_name}.mp4")
# coord_path = os.path.join(COORD_FOLDER, f"{video_name}.pkl")

# # load the coordinates
# with open(coord_path, 'rb') as f:
#     coord = pickle.load(f)

# squat, release = get_key_frames(coord, useLeft=True, kneeAngleThreshold=160)

# squat = 90
# release = 134

# frame = get_frame_at_index(video_path, squat)

# draw_circle(frame, coord[squat]['leftAnkle'])
# draw_circle(frame, coord[release]['leftHand'])

# # display the frame
# cv2.imshow('image',frame)
# cv2.waitKey(0)

# save_subclip(video_path, squat-80, release-70)
