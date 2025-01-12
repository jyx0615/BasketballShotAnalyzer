from process_video import init_mediapipe_model, process_single_video
from ball import process_video
from parse_coords import get_key_points
from transform import combine, resize_to_same_height
from chat import getAdvice
import os


def comparison_anaylze(video1_path, video2_path):
    directory_path = os.path.dirname(video1_path)
    output1_video_path = os.path.join(directory_path, "skeleton1.mp4")
    output2_video_path = os.path.join(directory_path, "skeleton2.mp4")
    coord1_path = os.path.join(directory_path, "coord1.pkl")
    coord2_path = os.path.join(directory_path, "coord2.pkl")
    resize_to_same_height(video1_path, video2_path)
    resized_path = os.path.join(directory_path, "resized_video.mp4")
    
    init_mediapipe_model()
    fps1 = process_single_video(resized_path, output1_video_path, coord1_path)
    keypoints1 = get_key_points(resized_path, coord1_path, fps1, index=1)
    fps2 = process_single_video(video2_path, output2_video_path, coord2_path)
    keypoints2 = get_key_points(video2_path, coord2_path, fps2, index=2)
    combine(output1_video_path, coord1_path, output2_video_path, coord2_path)

    # for key, value in keypoints1.items():
    #     print(f'{key}: {value}')
    # print()
    # for key, value in keypoints2.items():
    #     print(f'{key}: {value}')

    scenario = "The player is currently comparing their shot technique to that of a role model. Below are relevant statistics and details regarding the player's current performance and the role model's shooting technique. Please analyze the differences and offer tailored advice on how the player can improve their shot posture."

    user_query = f"This is my statistics:\n{keypoints1}\n\nThis is the role model statistics:\n{keypoints2}"
    advise = getAdvice(scenario, user_query)
    return advise


def individual_analyze(video, output_video_path, output_image_path):
    results = process_video(video, show_output=False, save_output=True, output_video_path=output_video_path, output_image_path=output_image_path)

    scenario = "The player currently has shooting statistics, including the relative position of the ball compared to the rim and the stability score. Based on these statistics, please analyze the player's shot and provide tailored instructions and drills to help improve their shooting hit rate."
    user_query = f"This is my statistics:\n{results}"
    advise = getAdvice(scenario, user_query)
    return advise


# individual_analyze("shooting4.mp4")
# comparison_anaylze("curry.mp4", "shooting3.mp4")