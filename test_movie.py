# Create a file called test_moviepy.py
from moviepy.editor import ColorClip

# Create a simple 2-second red clip
clip = ColorClip(size=(100, 100), color=(255, 0, 0), duration=2)

# Try to generate a video
try:
    clip.write_videofile("test_output.mp4", fps=24)
    print("MoviePy works correctly!")
except Exception as e:
    print(f"Error: {e}")