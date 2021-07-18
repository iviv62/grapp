from django.core.files.storage import FileSystemStorage
from main.settings import BASE_DIR
from django.db import models


upload_storage = FileSystemStorage(location=BASE_DIR, base_url='/bin')

class Command(models.Model):
    name = models.CharField(max_length=50)
    terminal_command = models.CharField(max_length=1000)
    file = models.FileField(upload_to='bin', storage=upload_storage)

    def __str__(self): 
        return self.name 


class CommandParameter(models.Model):
    command = models.ForeignKey(Command,on_delete=models.CASCADE,)
    key = models.CharField(max_length=320,blank=True,)
    value = models.CharField(max_length=128,blank=True,)