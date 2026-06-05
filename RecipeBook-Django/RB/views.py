from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from RB.models import RecipeSet
from django.contrib import messages
from RB.models import rb
from .models import Item
from django.db.models import Q

from .models import Item, Comment
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from project.settings import EMAIL_HOST_USER
# from django.shortcuts import render

def send_feedback(request):
    if request.method == "POST":
        email = request.POST.get('email')
        message = request.POST.get('message')
        subject = request.POST.get('subject')
        # Ensure email and message are not empty
        if email and message:
            # Send the email
            send_mail(
                subject=f"Feedback from user {subject}",
                message=message,
                from_email='rcpibook@gmail.com',  # Replace with your email
                recipient_list=['rcpibook@gmail.com'],  # Replace with the email where you want to receive feedback
                fail_silently=False,
            )
            messages.success(request, "Feed back sent sucessfully")
            return HttpResponseRedirect("/new/")  # Redirect to a thank-you page after submission
    
    return render(request, "home.html")  # Optional error page if feedback fails
def index(request):
    return render(request, "index.html")

def about(request):
    return render(request, "about.html")
def ab(request):
    return render(request, "ab.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
        else:
            user = User.objects.create_user(username=username,  email=email, password=password)
            user.save()
            messages.success(request, "Account created successfully")
            return redirect("login")
    return render(request, "register.html")


def user_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        
        password = request.POST["password"]
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_superuser:  # Check if the user is a superuser
                return redirect("/admin/")
            return redirect("new")
        else:
            messages.error(request, "Invalid credentials")
    return render(request, "login.html")

def user_logout(request):
    logout(request)
    return redirect("login")



def home(request):
    items = Item.objects.filter(created_by=request.user)
    for i in items:
        i.image="/media/"+str(i.image)
    return render(request, "home.html", {"items": items})




def index(request):
    all_dishes = Item.objects.all()
    dishes = all_dishes
    if request.method == "POST":
        title_query = request.POST.get('tit')  # Get the title from the search bar
        ingredients_query = request.POST.get('ind')  # Get the ingredients from the second search bar
        difficulty = request.POST.get('difficulty')
        if title_query:  # If title search is not empty
            dishes = all_dishes.filter(title__icontains=title_query)  # Case-insensitive title search
            

        # if ingredients_query:  # If ingredients search is not empty
        #     dishes = all_dishes.filter(ingredients__icontains=ingredients_query)  # Case-insensitive ingredients search
        
        if ingredients_query:  # If ingredients search is not empty
            # Split the ingredients by commas and create a Q object for case-insensitive partial matches
            ingredients_list = [ingredient.strip() for ingredient in ingredients_query.split(",")]
            ingredient_filter = Q()
            for ingredient in ingredients_list:
                ingredient_filter |= Q(ingredients__icontains=ingredient)
            dishes = dishes.filter(ingredient_filter)
        
        
        
        
        if difficulty:
            if difficulty == "Easy":
                dishes = dishes.filter(time__lte=20)
            elif difficulty == "Medium":
                dishes = dishes.filter(time__gt=20, time__lte=40)
            elif difficulty == "Hard":
                dishes = dishes.filter(time__gt=40)
            else:
                dishes = "NULL"
            
            
    # for i in all_dishes:
    #     i.image = "/media/" + str(i.image)

    # for i in dishes:
    #     i.image = "/media/" + str(i.image)
    
    return render(request, "index.html", {"itm":all_dishes, "dishes": dishes})






def upload_recipe(request):
    if request.method == "POST":
        title = request.POST.get('title')  # Recipe title
        
        ingredients = request.POST.get('ingredients')  # Serialized ingredients
        instructions = request.POST.get('instructions')  # Serialized instructions
        time = request.POST.get('time')  # Time in minutes
        dish = request.POST.get('dish')  # Dish type

        # Validate if user is logged in
        if not request.user.is_authenticated:
            messages.error(request, "You must be logged in to upload a recipe.")
            return redirect("login")

        # Save the recipe in the database
        try:
            rs = RecipeSet(
                user=request.user,
                title=title,
                # image=image,
                ingredients=ingredients,
                instructions=instructions,
                time=int(time),  # Convert to integer
                dish=dish,
            )
            rs.save()
            messages.success(request, "Recipe uploaded successfully!")
        except Exception as e:
            messages.error(request, f"An error occurred: {str(e)}")
            return redirect("login")

    return render(request, "upload_recipe.html")

def p(request):
    if request.method == "POST":
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        address = request.POST.get('address')
        rr = rb(name=name, phone=phone, email=email, address=address)
        rr.save()

    return render(request, "p.html")

def add_item(request):
    user = request.user.username
    if request.method == "POST":
        title = request.POST["title"]
        image = request.FILES["image"]
        ingredients = request.POST["ingredients"]
        instructions = request.POST["instructions"]
        time = request.POST["time"]
        dish = request.POST["dish"]

        created_by = User.objects.get(username=user)
        
        item = Item.objects.create(
                title=title, image=image, ingredients=ingredients, instructions=instructions, time=time, dish=dish, created_by=created_by
            )
        item.save()
        return redirect("home")
    return render(request, "add.html")

#yj testing

def item_detail(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    item.ingredients = item.ingredients.split(",")
    item.instructions = item.instructions.split(",")
    comments = Comment.objects.filter(item=item).order_by('-created_at')
    # if request.method == "POST":
    #     text = request.POST.get('text')
    #     rating = request.POST.get('rating')
    #     if text and rating and request.user.is_authenticated:
    #         rating = int(rating)
    #         if 1 <= rating <= 5:  # Validate rating range
    #             Comment.objects.create(item=item, user=request.user, text=text, rating=rating)
    #             return redirect('product_detail', product_id=item.id)

    
    return render(request, 'item_detail.html', {'item': item,'comments': comments})

@login_required
def product_detail(request, product_id):
    # product = "NULL"
    product = get_object_or_404(Item, id=product_id)
    product.ingredients = product.ingredients.split(",")
    product.instructions = product.instructions.split(",")
    pd = product.dish
    filtereddishes = Item.objects.filter(dish=pd).select_related('created_by')
    for i in filtereddishes:
        i.image = "/media/" + str(i.image)
        i.instructions = i.instructions.split(",")
    
    # return render(request, 'product_detail.html', {"itss": filtereddishes,'product': product})

    comments = Comment.objects.filter(item=product).order_by('-created_at')

    if request.method == "POST":
        text = request.POST.get('text')
        rating = request.POST.get('rating')
        if text and rating and request.user.is_authenticated:
            rating = int(rating)
            if 1 <= rating <= 5:  # Validate rating range
                Comment.objects.create(item=product, user=request.user, text=text, rating=rating)
                return redirect('product_detail', product_id=product.id)

    return render(request, 'product_detail.html', {
        "itss": filtereddishes,
        'product': product,
        'comments': comments,
        
    })

    


def new(request):
    all_dishes = Item.objects.all()
    dishes = all_dishes
    if request.method == "POST":
        title_query = request.POST.get('tit')  # Get the title from the search bar
        ingredients_query = request.POST.get('ind')  # Get the ingredients from the second search bar
        difficulty = request.POST.get('difficulty')
        if title_query:  # If title search is not empty
            dishes = all_dishes.filter(title__icontains=title_query)  # Case-insensitive title search
            

        # if ingredients_query:  # If ingredients search is not empty
        #     dishes = all_dishes.filter(ingredients__icontains=ingredients_query)  # Case-insensitive ingredients search
        
        if ingredients_query:  # If ingredients search is not empty
            # Split the ingredients by commas and create a Q object for case-insensitive partial matches
            ingredients_list = [ingredient.strip() for ingredient in ingredients_query.split(",")]
            ingredient_filter = Q()
            for ingredient in ingredients_list:
                ingredient_filter |= Q(ingredients__icontains=ingredient)
            dishes = dishes.filter(ingredient_filter)
        
        
        
        
        if difficulty:
            if difficulty == "Easy":
                dishes = dishes.filter(time__lte=20)
            elif difficulty == "Medium":
                dishes = dishes.filter(time__gt=20, time__lte=40)
            elif difficulty == "Hard":
                dishes = dishes.filter(time__gt=40)
            else:
                dishes = "NULL"
            
            
    # for i in all_dishes:
    #     i.image = "/media/" + str(i.image)

    # for i in dishes:
    #     i.image = "/media/" + str(i.image)
    
    return render(request, "new.html", {"itm":all_dishes, "dishes": dishes})


def update_item(request, item_id):
    item = get_object_or_404(Item, id=item_id, created_by=request.user)
    item.ingredients = item.ingredients.split(",")
    item.instructions = item.instructions.split(",")
    if request.method == "POST":
        item.title = request.POST.get("title")
        item.ingredients = request.POST.get("ingredients")
        item.instructions = request.POST.get("instructions")
        item.time = request.POST.get("time")
        # item.dish = request.POST.get("dish")
        item.save()
        return redirect("home")
    return render(request, "update.html", {"item": item})


def delete_item(request, id):
    item = Item.objects.get(id=id)
    item.delete()
    return redirect("home")




def user_recipes(request, user_id):
    user = get_object_or_404(User, id=user_id)
    recipes = Item.objects.filter(created_by=user)
    for recipe in recipes:
        recipe.image = "/media/" + str(recipe.image)
    
    return render(request, 'user_recipes.html', {'user': user, 'recipes': recipes})








