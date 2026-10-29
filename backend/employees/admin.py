from django.contrib import admin

from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("employee_id", "name", "email", "job_title", "team", "is_active")
    list_filter = ("team", "is_active")
    search_fields = ("employee_id", "name", "email", "job_title")