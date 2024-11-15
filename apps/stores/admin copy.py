from django.contrib import admin
from .models import Store, StoreFollow, Collection

# Register your models here.
admin.site.register(Store)
admin.site.register(StoreFollow)
admin.site.register(Collection)
