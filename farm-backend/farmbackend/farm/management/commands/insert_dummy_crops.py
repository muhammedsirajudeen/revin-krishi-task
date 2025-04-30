from django.core.management.base import BaseCommand
from farm.models import Crop
import uuid

class Command(BaseCommand):
    help = 'Insert 10 dummy crop entries into the database'

    def handle(self, *args, **kwargs):
        dummy_crops = [
            ("Wheat", "https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Rice",  "https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Corn",  "https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Tomato","https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Potato","https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Carrot","https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Onion", "https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Soybean",   "https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Barley","https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
            ("Peas",  "https://imgs.search.brave.com/wADBgYcDvBKhHdiGbywdB3IGNteXO9FYBu5h8egCBCQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc5/NjI5NDM4L3Bob3Rv/L3doZWF0LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1mSnBU/QkNMVmFzbF9kYk1n/a29mWWVadXhCYmhw/eFo2dU05SXhnTXpF/aUFvPQ"),
        ]


        for name, image in dummy_crops:
            Crop.objects.create(
                id=uuid.uuid4(),
                name=name,
                image=image
            )

        self.stdout.write(self.style.SUCCESS("Successfully inserted 10 dummy crops."))
