from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class RecipeSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=122)
    # image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    ingredients = models.TextField()
    instructions = models.TextField()
    time = models.IntegerField()
    dish = models.CharField(max_length=8)

    def __str__(self):
        return f"{self.name} by {self.user.username}"
    
class rb(models.Model):
    name = models.CharField(max_length=122)
    phone = models.CharField(max_length=122)
    email = models.CharField(max_length=122)
    address = models.TextField()

class Item(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(null=True, blank=True, upload_to="image/")
    ingredients = models.TextField()
    instructions = models.TextField()
    time = models.DecimalField(max_digits=10, decimal_places=2)
    dish = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

def get_instructions_as_list(self):
    return self.instructions.split(',')

class Comment(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.item.title} ({self.rating}/5)"


