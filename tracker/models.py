from django.db import models
from django.contrib.auth.models import User

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    name = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)

class Exercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="exercises")
    name = models.CharField(max_length=100)

class ExerciseSet(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="sets")
    weight = models.FloatField()
    reps = models.IntegerField()

# models.py
class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)

class Exercise(models.Model):
    # related_name='exercises' sayesinde workout.exercises.all diyebiliriz
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=100)

class ExerciseSet(models.Model):
    # related_name='sets' sayesinde exercise.sets.all diyebiliriz
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='sets')
    weight = models.FloatField(default=0)
    reps = models.IntegerField(default=0)

class Exercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='exercises')
    # ...

class ExerciseSet(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='sets')
    # ...
