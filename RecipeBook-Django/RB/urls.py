

from django.urls import path 
from . import views

urlpatterns = [
    #added belo line
    path("p/", views.p, name='p'),
    #"" to regiter
    path("register/", views.register, name='register'),
    path("login/", views.user_login, name="login"),
    path("logout/", views.user_logout, name='logout'),
    path("home/", views.home, name='home'),
    path("upload_recipe/",views.upload_recipe, name='upload_recipe'),
    path("",views.index, name='index'),
     path("add/", views.add_item, name="add"),
     path("new/", views.new, name="new"),

     #yj testing
      path('item/<int:item_id>/', views.item_detail, name='item_detail'),
      
      
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),

     path('update/<int:item_id>/', views.update_item, name='update_item'),

     path("delete/<int:id>/", views.delete_item, name="delete"),

     path('user/<int:user_id>/', views.user_recipes, name='user_recipes'),

      path('send-feedback/', views.send_feedback, name='send_feedback'),

      path("about/", views.about, name='about'),

       path("ab/", views.ab, name='ab'),

    
]
