import numpy as np

# euclidean distance
def distance(x, y):
    return ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2) ** (1/2)


# the angle between vector(ba) and vector(bc)
def calculateAngle(a, b, c):
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.arccos(cosine_angle)
    return round(np.degrees(angle), 2)


def unnormalizeCoord(coord, width, height):
    return np.array([int(coord[0] * width), int(coord[1] * height)])
