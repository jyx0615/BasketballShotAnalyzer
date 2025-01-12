import os, cv2
from ultralytics import YOLO
import numpy as np
from scipy.optimize import curve_fit

BALL_CLASS = 0

path_points = []
ball_pos = []
color_list = []
total = 0
score = 0
close = 0
far = 0
coefficients = []
start_points = []

# euclidean distance_square
def distance_square(x, y):
  return (y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2


def isScore(a, b, c, hoopCoord, height, threshold=10):
  global total, score, far, close
  total += 1
  y = height - hoopCoord['up']
  x = (-b - np.sqrt(b ** 2 - 4 * a * (c - y))) / (2 * a)
  if x > hoopCoord['left'] + threshold and x < hoopCoord['right'] - threshold:
    score += 1
    return True
  elif x <= hoopCoord['left'] + threshold:
    close += 1
  elif x >= hoopCoord['right'] - threshold:
    far += 1
  return False


def fit_func(x, a, b, c):
  return a * x**2 + b * x + c


def trajectory_fit(balls, height, width, frame, hoopCoord, threshold=100):
  global path_points, ball_pos, color_list, coefficients, start_points
  if len(balls) < 3:
    return
  
  # the last point may not be accurate when the ball hits the hoop

  # fit without the last point
  x = [ball[0] for ball in balls[:-1]]
  y = [height - ball[1] for ball in balls[:-1]]
  params = curve_fit(fit_func, x, y)
  [a, b, c] = params[0]

  # fit with the last point
  x = [ball[0] for ball in balls]
  y = [height - ball[1] for ball in balls]
  params_with_last = curve_fit(fit_func, x, y)
  [a_last, b_last, c_last] = params_with_last[0]

  # Check if the change is within the threshold
  if (abs(c_last - c) < threshold):
    a, b, c = a_last, b_last, c_last
    print(f"Fitting equation with last point: {a:.2f}x^2 + {b:.2f}x + {c:.2f}")
  else:
    balls.remove(balls[-1])
    print(f"Fitting equation without last point: {a:.2f}x^2 + {b:.2f}x + {c:.2f}")

  coefficients.append((a, b, c))
  start_points.append((balls[0][0], height - balls[0][1]))
  # determine if the ball score the hoop
  score = isScore(a, b, c, hoopCoord, height)

  # use quadratic function to fit the trajectory
  x_pos = np.arange(0, width, 1)
  y_pos = [(a * (x ** 2)) + (b * x) + c for x in x_pos]
  # y_pos2 = [(a_last * (x ** 2)) + (b_last * x) + c_last for x in x_pos]

  # Convert positions to points
  points = np.array([(int(x), int(height - y)) for x, y in zip(x_pos, y_pos)], dtype=np.int32)
  # points2 = np.array([(int(x), int(height - y)) for x, y in zip(x_pos, y_pos2)], dtype=np.int32)
  color = (0, 0, 255) if score else (255, 0, 0)

  # Draw the quadratic line
  line_frame = frame.copy()
  cv2.polylines(line_frame, [points], isClosed=False, color=color, thickness=8)
  # cv2.polylines(line_frame, [points2], isClosed=False, color=(0, 0, 255), thickness=8)

  # draw the ball postition
  for x,y in balls:
    cv2.circle(img=frame, center=(x, y), radius=6, color=color, thickness=-1)

  cv2.addWeighted(frame, 0.6, line_frame, 0.4, 0, frame)

  path_points.append([points])
  ball_pos.append(balls)
  color_list.append(color)


def ball_far_from_hoop(ball, hoop, threshold=300):
  return distance_square(ball, (hoop['left'], hoop['up'])) > threshold


def ball_near_body(ball, body, threshold = 50):
  if(body is None):
    return False
  if(ball[0] > body['left'] - threshold and ball[0] < body['right'] + threshold and 
     ball[1] > body['up'] - threshold and ball[1] < body['down'] + threshold):
    return True
  return False


# the y is start from the top
def ball_pass_hoop(ball_y, prev_ball_y, hoop):
  if(prev_ball_y is None):
    return False
  if(ball_y > hoop['up'] and prev_ball_y < hoop['up']):
    # print('ball pass hoop')
    return True
  return False


def isAscending(ball, previous_ball):
  if(previous_ball[0] is None):
    return False
  return ball[1] < previous_ball[1]


def get_person_coord(model, frame, threshold=0.8):
  # Perform detection
  results = model.track(frame, persist=True, tracker="botsort.yaml", verbose=False, conf=threshold)

  # Draw bounding boxes and labels on the frame
  for result in results:
    for box in result.boxes:
      x1, y1, x2, y2 = map(int, box.xyxy[0])
      return {
        'left': x1,
        'right': x2,
        'up': y1,
        'down': y2
      }


def get_hoop_coord(frame, model, threshold=0.5):
  results = model.track(frame, persist=True, tracker="botsort.yaml", verbose=False, conf=threshold)
  # results = model.predict(frame, verbose=False, conf=threshold)
  boxes = results[0].boxes.data
      
  for box in boxes:
    if len(box) == 6:
      x1, y1, x2, y2, conf, cls = box  # Coordinates and confidence
    else:
      x1, y1, x2, y2, id, conf, cls = box

    # it is a hoop
    if cls == 1:
      hoopCoord = {
        'left': int(x1),
        'right': int(x2),
        'up': int(y1),
        'down': int(y2)
      }
      return hoopCoord
  return None


def get_ball_coord(frame, model, threshold=0.4):
  # ball detection
  results = model.track(frame, persist=True, tracker="botsort.yaml", verbose=False, conf=threshold)
  boxes = results[0].boxes.data
  boxes = [box for box in boxes if box[-1] == BALL_CLASS]
  
  # Draw only filtered boxes on the frame
  for box in boxes:
    if len(box) == 6:
      x1, y1, x2, y2, conf, cls = box  # Coordinates and confidence
    else:
      x1, y1, x2, y2, id, conf, cls = box
    xCoor = int(np.mean([x1, x2]))
    yCoor = int(np.mean([y1, y2]))
    r = int(np.abs(x1 - x2) / 2)
    return xCoor, yCoor, r
  return None, None, None


def start_shooting(current_ball_position, previous_ball, body_coord, hoopCoord):
  # start shooting (when the ball is far from rim and near hand)
  if(ball_near_body(current_ball_position, body_coord) and ball_far_from_hoop(current_ball_position, hoopCoord)     and isAscending(current_ball_position, previous_ball)):
    return True
  return False


def end_shooting(current_ball_position, previous_ball, hoopCoord, ascending):
  # end shooting when the ball pass the hoop or hit the hoop and bounce back
  if (ball_pass_hoop(current_ball_position[1], previous_ball[1], hoopCoord) or (not ascending and isAscending(current_ball_position, previous_ball))):
    return True
  return False


def draw_path_image(frame, hoopCoord, save_image=True, output_image_path="path.jpg", show_image=False):
  paths = np.zeros_like(frame)
  balls = np.zeros_like(frame)
  for i in range(len(path_points)):
    # Draw the quadratic line
    cv2.polylines(paths, path_points[i], isClosed=False, color=color_list[i], thickness=8)

    # draw the ball postition
    for x,y in ball_pos[i]:
      cv2.circle(img=balls, center=(x, y), radius=6, color=color_list[i], thickness=-1)

  # draw the hoop
  if hoopCoord is not None:
    cv2.rectangle(balls, (int(hoopCoord['left']), int(hoopCoord['down'])), (int(hoopCoord['right']), int(hoopCoord['up'])), (0, 255, 0), 2)
    cv2.rectangle(balls, (int(hoopCoord['left']), int(hoopCoord['down'])), (int(hoopCoord['right']), int(hoopCoord['up'])), (0, 255, 0), 2)

  cv2.addWeighted(balls, 1, paths, 0.6, 0, balls)
  if show_image:
    cv2.imshow("Path", balls)
    cv2.waitKey(0)

  if save_image:
    cv2.imwrite(output_image_path, balls)
    # print("save image to ", output_image_path)

  return balls
  

def calculate_stability_metrics():
    # Extract coefficients and starting points
    a_values = np.array([coef[0] for coef in coefficients])
    b_values = np.array([coef[1] for coef in coefficients])
    x0_values = np.array([point[0] for point in start_points])
    y0_values = np.array([point[1] for point in start_points])
    
    # Calculate vertices adjusted for the starting point
    x_vertex = x0_values - b_values / (2 * a_values)
    y_vertex = a_values * (x_vertex - x0_values)**2 + b_values * (x_vertex - x0_values) + y0_values
    
    # Calculate release angles (in degrees)
    release_angles = np.degrees(np.arctan(b_values))
    
    # Variability metrics
    std_x_vertex = np.std(x_vertex)  # Standard deviation of x_vertex
    std_y_vertex = np.std(y_vertex)  # Standard deviation of y_vertex
    std_release_angle = np.std(release_angles)  # Standard deviation of release angles
    std_curvature = np.std(a_values)  # Standard deviation of curvature (a values)
    
    # Normalize metrics to make them comparable
    norm_std_x_vertex = std_x_vertex / np.mean(np.abs(x_vertex))
    norm_std_y_vertex = std_y_vertex / np.mean(np.abs(y_vertex))
    norm_std_release_angle = std_release_angle / np.mean(np.abs(release_angles))
    norm_std_curvature = std_curvature / np.mean(np.abs(a_values))
    
    # Weighted stability score (lower variability means higher stability)
    stability_score = 1 / (
        0.3 * norm_std_x_vertex +
        0.3 * norm_std_y_vertex +
        0.2 * norm_std_release_angle +
        0.2 * norm_std_curvature
    )
    
    # Pack results into a dictionary
    results = {
        "number of shoot": total,
        "hit": score,
        "shoot too far": far,
        "shoot too close": close,
        "hit rate": score / total,
        "x_vertex": x_vertex.tolist(),
        "y_vertex": y_vertex.tolist(),
        "release_angles": release_angles.tolist(),
        "std_x_vertex": std_x_vertex,
        "std_y_vertex": std_y_vertex,
        "std_release_angle": std_release_angle,
        "std_curvature": std_curvature,
        "norm_std_x_vertex": norm_std_x_vertex,
        "norm_std_y_vertex": norm_std_y_vertex,
        "norm_std_release_angle": norm_std_release_angle,
        "norm_std_curvature": norm_std_curvature,
        "stability_score": stability_score
    }
    
    return results


def process_video(video_path, show_output=False, save_output=True, output_video_path="ball_path.mp4", output_image_path="path.jpg"):
  # Load the pretrained model to detect basketball
  ball_model = YOLO('models/ball.pt')
  # ball_model = YOLO('models/basketballModel.pt')
  hoop_model = YOLO('models/hoop.pt')
  person_model = YOLO('models/yolo11n.pt')
  person_model.classes = [0]  # Set to detect only persons (class 0)

  ball_detection_theshold = 0.7  # Confidence threshold for detection
  hoop_detection_theshold = 0.4  # Confidence threshold for detection
  person_detection_theshold = 0.8  # Confidence threshold for detection

  cap = cv2.VideoCapture(video_path)
  height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
  width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
  fps = cap.get(cv2.CAP_PROP_FPS)

  if save_output:
    out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width * 2, height))

  start = True
  frame_count = 0  # Frame counter
  process_interval = 3   # Number of frames to skip before processing
  ball_frame_count = 0  # Counter for frames since last ball point addition
  draw_interval = 2  # Number of frames to skip before drawing a new point

  hoopCoord = None
  shooting = False
  current_ball_position = (None, None)  # To store current ball coordinates
  empty_frame = []
  ascending = False

  while cap.isOpened():
    success, frame = cap.read()
    if not success:
      break

    # Create a blank image to store the path of basketball
    if start:
      start = False
      empty_frame = np.zeros_like(frame)
      path_image = np.zeros_like(frame)
      cur_path_image = np.zeros_like(frame)
    
    frame_count += 1

    if frame_count % process_interval == 0:
      # get the person coordinates
      body_coord = get_person_coord(person_model, frame, threshold=person_detection_theshold)

      # get the hoop coordinates
      # hoopCoord = get_hoop_coord(frame, hoop_model, threshold=hoop_detection_theshold) or hoopCoord
      # if hoopCoord is not None:
      #   # draw the hoop on the frame
      #   cv2.rectangle(cur_path_image, (int(hoopCoord['left']), int(hoopCoord['down'])), (int(hoopCoord['right']), int(hoopCoord['up'])), (0, 255, 0), 2)
      if hoopCoord is None:
        hoopCoord = get_hoop_coord(frame, hoop_model, threshold=hoop_detection_theshold) or hoopCoord
      if hoopCoord is not None:
        # draw the hoop on the frame
        cv2.rectangle(cur_path_image, (int(hoopCoord['left']), int(hoopCoord['down'])), (int(hoopCoord['right']), int(hoopCoord['up'])), (0, 255, 0), 2)
    
      # get the ball coordinates
      xCoor, yCoor, r = get_ball_coord(frame, ball_model, threshold=ball_detection_theshold)
      if xCoor is not None:
        previous_ball = current_ball_position
        current_ball_position = (xCoor, yCoor)  # Update current ball position

        # Draw the current position of the ball on the frame
        if shooting:
          cv2.circle(img=frame, center=(xCoor, yCoor), radius=r, color=(235, 103, 193), thickness=-1)
          cv2.circle(img=cur_path_image, center=(xCoor, yCoor), radius=6, color=(235, 103, 193), thickness=-1)

        # Draw the path every 3 frames
        ball_frame_count += 1  # Increment the ball frame counter
        if ball_frame_count >= draw_interval and shooting:
          ballCoords.append((xCoor, yCoor))  # Append the new ball coordinate
          ball_frame_count = 0  # Reset the ball frame counter
        
        # check the shooting phase
        if(hoopCoord is not None):
          # start shooting (when the ball is far from rim and near hand)
          if(not shooting and start_shooting(current_ball_position, previous_ball, body_coord, hoopCoord)):
            shooting = True
            ascending = True
            ballCoords = []   # List to store the ball coordinates
          
          # the ball is falling
          if(shooting and not isAscending(current_ball_position, previous_ball)):
            ascending = False
          
          # ball hits or miss
          if(shooting and end_shooting(current_ball_position, previous_ball, hoopCoord, ascending)):
            shooting = False
            trajectory_fit(ballCoords, height, width, path_image, hoopCoord)

            # reset the current ball memory
            cur_path_image = np.zeros_like(frame)

    # Combine the original frame with the path image
    video_frame = cv2.addWeighted(frame, 1, cur_path_image, 0.5, 0)
    path_frame = cv2.addWeighted(path_image, 1, cur_path_image, 1, 0)

    # Concatenate the images horizontally
    side_by_side = cv2.hconcat([video_frame, path_frame])

    # Display the combined image
    if show_output:
      cv2.imshow("Side by Side Display", side_by_side)
      keys = cv2.waitKey(1) & 0xFF
      if keys == ord('q'):
        break

    # save the output video
    if save_output:
      out.write(side_by_side)

  # Release the video capture object and close the display window
  cap.release()
  cv2.destroyAllWindows()

  if save_output:
    # print("save the output video to ", output_video_path)
    out.release()

  draw_path_image(empty_frame, hoopCoord, True, output_image_path, False)

  results = calculate_stability_metrics()

  return results


# process_video("shooting4.mp4")