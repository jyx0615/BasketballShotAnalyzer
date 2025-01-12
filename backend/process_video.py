import os, pickle, cv2
import numpy as np
import mediapipe as mp

from utils import unnormalizeCoord, calculateAngle
from draw import draw_elbow_angle, draw_knee_angle, draw_hand_angle

mp_pose = None
pose = None
mp_drawing = None

# get the coordinates file from a video

# get landmark from mediapipe
def extract_keypoints_from_frame(frame):
    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Get the pose landmarks
    results = pose.process(rgb_frame)

    if results.pose_landmarks:
        return results.pose_landmarks
    return None


# get coordinates from the landmark (mp.landmak -> np.array)
def getCoord(landmark, width, height):
    return unnormalizeCoord(np.array([landmark.x, landmark.y]), width, height)


# return the coordinates of joints(head, hand, ...)
def parse_landmarks(pose_landmarks, width, height):
    landmarks = pose_landmarks.landmark
    headCoord = getCoord(landmarks[mp_pose.PoseLandmark.NOSE], width, height)
    handCoord = getCoord(landmarks[mp_pose.PoseLandmark.RIGHT_WRIST], width, height) 
    hipCoord = getCoord(landmarks[mp_pose.PoseLandmark.RIGHT_HIP], width, height)
    kneeCoord = getCoord(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE], width, height)
    ankleCoord = getCoord(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE], width, height)
    shoulderCoord = getCoord(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER], width, height)
    elbowCoord = getCoord(landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW], width, height)

    leftHandCoord = getCoord(landmarks[mp_pose.PoseLandmark.LEFT_WRIST], width, height) 
    leftHipCoord = getCoord(landmarks[mp_pose.PoseLandmark.LEFT_HIP], width, height)
    leftKneeCoord = getCoord(landmarks[mp_pose.PoseLandmark.LEFT_KNEE], width, height)
    leftAnkleCoord = getCoord(landmarks[mp_pose.PoseLandmark.LEFT_ANKLE], width, height)
    leftShoulderCoord = getCoord(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER], width, height)
    leftElbowCoord = getCoord(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW], width, height)

    return {
        'head': headCoord,
        'hand': handCoord,
        'hip': hipCoord,
        'knee': kneeCoord,
        'ankle': ankleCoord,
        'shoulder': shoulderCoord,
        'elbow': elbowCoord,
        'leftHand': leftHandCoord,
        'leftHip': leftHipCoord,
        'leftKnee': leftKneeCoord,
        'leftAnkle': leftAnkleCoord,
        'leftShoulder': leftShoulderCoord,
        'leftElbow': leftElbowCoord
    }


# display the keypoints on the frame
def draw_keypoints(frame, pose_landmarks):
    if pose_landmarks:
        mp_drawing.draw_landmarks(frame, pose_landmarks, mp_pose.POSE_CONNECTIONS)


# given a frame and draw keypoints and angle text on the frame
def detect_keypoints(frame, width, height, landmarks):
    Coords = parse_landmarks(landmarks, width, height)
    kneeAngle = calculateAngle(Coords['hip'], Coords['knee'], Coords['ankle'])
    elbowAngle = calculateAngle(Coords['shoulder'], Coords['elbow'], Coords['hand'])

    leftKneeAngle = calculateAngle(Coords['leftHip'], Coords['leftKnee'], Coords['leftAnkle'])
    leftElbowAngle = calculateAngle(Coords['leftShoulder'], Coords['leftElbow'], Coords['leftHand'])
    handAngle = calculateAngle(Coords['hip'], Coords['shoulder'], Coords['elbow'])

    Coords['kneeAngle'] = kneeAngle
    Coords['elbowAngle'] = elbowAngle
    Coords['leftKneeAngle'] = leftKneeAngle
    Coords['leftElbowAngle'] = leftElbowAngle
    Coords['handAngle'] = handAngle

    draw_elbow_angle(frame, Coords)
    draw_knee_angle(frame, Coords)
    # draw_hand_angle(frame, Coords)

    # draw the keypoints
    # draw_keypoints(frame, landmarks)
    return Coords


def init_mediapipe_model():
    global mp_pose, pose, mp_drawing
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()
    mp_drawing = mp.solutions.drawing_utils


# get coordinate from a video and save the coordinate to a file
def process_single_video(input_path, output_path, coord_path, show = False):
    print("Processing video: ", input_path)
    # Open the video file
    cap = cv2.VideoCapture(input_path)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0

    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), 30, (frame_width, frame_height))

    # Check if the video was successfully opened
    if not cap.isOpened():
        print("Error: Could not open video.")
        exit()

    landmark_list = []
    # Process the video frame by frame
    while cap.isOpened():
        # Read a frame from the video
        ret, frame = cap.read()  
        frame_count += 1
        
        if not ret:
            # print("Reached end of the video.")
            break
        
        landmarks = extract_keypoints_from_frame(frame)
        if (not landmarks):
            Coords = {}
        else:
            Coords = detect_keypoints(frame, frame_width, frame_height, landmarks)
            
        landmark_list.append(Coords)

        # frame count text
        # cv2.putText(frame, str(frame_count), (150, 150), cv2.FONT_HERSHEY_SIMPLEX, 5, (0, 0, 255), 4)
        out.write(frame)

        if show:
            # Display the frame with pose landmarks
            cv2.imshow('Pose Estimation', frame)
            # Press 'q' to exit the video display
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    # Release the video capture object and close the display window
    cap.release()
    cv2.destroyAllWindows()

    print("save the output video to ", output_path)
    out.release()

    # save the landmarks to coord_path
    with open(coord_path, 'wb') as f:
        pickle.dump(landmark_list, f)
    print("save the landmarks to ", coord_path)
    return fps


# init_mediapipe_model()
# process_single_video('shooting.mp4')