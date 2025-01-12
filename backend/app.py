import os

from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
import cv2

from chat import getTutorialLink
from main import comparison_anaylze, individual_analyze

app = Flask(__name__)
CORS(app)

def combine_two_images(image1, image2, output_path):
    img1 = cv2.imread(image1)
    img2 = cv2.imread(image2)
    # add some pad between the two images
    img1 = cv2.copyMakeBorder(img1, 0, 0, 0, 20, cv2.BORDER_CONSTANT, value=[255, 255, 255])
    img = cv2.hconcat([img1, img2])
    cv2.imwrite(output_path, img)

    os.remove(image1)
    os.remove(image2)


@app.route('/api/data', methods=['GET'])
def get_data():
    print("start to get link")
    link = getTutorialLink()
    print(link)
    return jsonify({"tutorial_link": link})


@app.route('/api/analyze/comparison', methods=['POST'])
def analyze_comparison():
    if 'video' not in request.files or 'comparison_video' not in request.files:
        return jsonify({"error": "Both video files must be provided"}), 400

    video = request.files['video']
    comparison_video = request.files['comparison_video']

    current_dir = os.path.dirname(os.path.abspath(__file__))
    base = video.filename.split(".")[0]
    os.makedirs(os.path.join(current_dir, "tmp", base), exist_ok=True)
    folder_path = os.path.join(current_dir, "tmp", base)

    # Save the video files to a temporary location
    video_path = os.path.join(folder_path, "input.mp4")
    comparison_video_path = os.path.join(folder_path, "role_model.mp4")
    video.save(video_path)
    comparison_video.save(comparison_video_path)

    # Process the video files (this is where your analysis logic would go)
    feedback = comparison_anaylze(video_path, comparison_video_path)

    result = {
        "message": "Successfully comparison anaysis",
        "filename": base,
        "feedback": feedback
    }

    return jsonify(result)


@app.route('/api/release/image/<filename>', methods=['GET'])
def get_release(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(current_dir, "tmp", filename)
    if not os.path.exists(os.path.join(image_path, "release1.jpg")) or \
       not os.path.exists(os.path.join(image_path, "release2.jpg")):
        return jsonify({"error": "Image not found"}), 404
    
    combine_two_images(os.path.join(image_path, "release1.jpg"), os.path.join(image_path, "release2.jpg"), os.path.join(image_path, "release.jpg"))
    return send_file(os.path.join(image_path, "release.jpg"))


@app.route('/api/lowest/image/<filename>', methods=['GET'])
def get_lowest(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(current_dir, "tmp", filename)
    if not os.path.exists(os.path.join(image_path, "lowest1.jpg")) or \
       not os.path.exists(os.path.join(image_path, "lowest2.jpg")):
        return jsonify({"error": "Image not found"}), 404

    combine_two_images(os.path.join(image_path, "lowest1.jpg"), os.path.join(image_path, "lowest2.jpg"), os.path.join(image_path, "lowest.jpg"))
    return send_file(os.path.join(image_path, "lowest.jpg"))


@app.route('/api/compare/video/<filename>', methods=['GET'])
def get_video2(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    video_path = os.path.join(current_dir, "tmp", filename)
    if not os.path.exists(os.path.join(video_path, "side.mp4")):
        return jsonify({"error": "Video not found"}), 404
    
    return send_from_directory(video_path, "side.mp4", as_attachment=False, mimetype='video/mp4')


@app.route('/api/analyze/individual', methods=['POST'])
def analyze_individual():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files['video']
    
    if video.filename == '':
        return jsonify({"error": "No selected file"}), 400

    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base = video.filename.split(".")[0]
    os.makedirs(os.path.join(current_dir, "tmp", base), exist_ok=True)
    folder_path = os.path.join(current_dir, "tmp", base)
    video_path = os.path.join(folder_path, "input.mp4")
    image_path = os.path.join(folder_path, "path.jpg")
    output_video_path = os.path.join(folder_path, "path.mp4")

    # Save the video file to a temporary location
    video.save(video_path)

    # Process the video file (this is where your analysis logic would go)
    feedback = individual_analyze(video_path, output_video_path, image_path)

    result = {
        "message": "Successfully anaysis",
        "filename": base,
        "feedback": feedback
    }

    return jsonify(result)


@app.route('/api/path/image/<filename>', methods=['GET'])
def get_path(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(current_dir, "tmp", filename)
    if not os.path.exists(os.path.join(image_path, "path.jpg")):
        return jsonify({"error": "Image not found"}), 404
    
    return send_from_directory(image_path, "path.jpg", mimetype='image/jpeg')


@app.route('/api/path/video/<filename>', methods=['GET'])
def get_video(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    video_path = os.path.join(current_dir, "tmp", filename)
    if not os.path.exists(os.path.join(video_path, "path.mp4")):
        return jsonify({"error": "Video not found"}), 404
    
    return send_from_directory(video_path, "path.mp4", as_attachment=False, mimetype='video/mp4')


@app.route('/api/tutorial', methods=['GET'])
def get_tutorial_link():
    link = getTutorialLink()
    return jsonify({"tutorial_link": link})


if __name__ == '__main__':
    # create a temporary directory to output files
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(current_dir, "tmp"), exist_ok=True)
    app.run(debug=True)