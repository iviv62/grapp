from django.contrib import admin
from .models import Command,CommandParameter


class InlineCommandParameter(admin.StackedInline):
    model = CommandParameter



class AdminCommand(admin.ModelAdmin):
    inlines=[InlineCommandParameter,]
    list_display=("name",'file',)
    search_fields = ("name",)

admin.site.register(Command,AdminCommand)
