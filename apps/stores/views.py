from django.shortcuts import render


# Create your views here.
def view_store(request):
    return render(request, "store.html")


def manage_inventory(request):
    return render(request, "manage_inventory.html")


def manage_orders(request):
    return render(request, "manage_orders.html")
