from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Employee


class EmployeeDirectoryApiTests(APITestCase):
    def setUp(self):
        self.employee = User.objects.create_user(
            email="employee@example.com",
            password="test-password-123",
        )
        self.manager = User.objects.create_user(
            email="manager@example.com",
            password="test-password-123",
            role=User.Role.MANAGER,
        )
        Employee.objects.create(
            employee_id="MC-001",
            name="Test Employee",
            email="employee@example.com",
            job_title="Developer",
            team="Engineering",
        )

    def test_anonymous_user_cannot_list_employees(self):
        response = self.client.get("/api/employees/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_employee_can_list_employees(self):
        self.client.force_authenticate(user=self.employee)

        response = self.client.get("/api/employees/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["employee_id"], "MC-001")

    def test_employee_cannot_create_employee(self):
        self.client.force_authenticate(user=self.employee)

        response = self.client.post(
            "/api/employees/",
            {
                "employee_id": "MC-002",
                "name": "Another Employee",
                "email": "another@example.com",
                "job_title": "Analyst",
                "team": "Operations",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_manager_can_create_employee(self):
        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/employees/",
            {
                "employee_id": "MC-002",
                "name": "Another Employee",
                "email": "another@example.com",
                "job_title": "Analyst",
                "team": "Operations",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Employee.objects.filter(employee_id="MC-002", team="Operations").exists()
        )