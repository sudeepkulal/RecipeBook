from django.contrib import admin
from RB.models import RecipeSet
from RB.models import rb
from RB.models import Item
from RB.models import Comment


# Register your models here.
admin.site.register(RecipeSet)
admin.site.register(rb)
admin.site.register(Item)
admin.site.register(Comment)