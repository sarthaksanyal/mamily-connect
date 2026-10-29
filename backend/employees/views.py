from rest_framework.viewsets import ModelViewSet

from .models import Employee
from .permissions import EmployeeDirectoryPermission
from .serializers import EmployeeSerializer


class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = (EmployeeDirectoryPermission,)
    search_fields = ("employee_id", "name", "email", "job_title", "team")
    ordering_fields = ("employee_id", "name", "team", "joining_date")
