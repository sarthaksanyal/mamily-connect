from django.db import models


class Employee(models.Model):
    employee_id = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=160)
    email = models.EmailField(unique=True)
    job_title = models.CharField(max_length=120)
    team = models.CharField(max_length=100)
    contact = models.CharField(max_length=32, blank=True)
    location = models.CharField(max_length=120, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name", "employee_id")

    def __str__(self):
        return f"{self.name} ({self.employee_id})"
