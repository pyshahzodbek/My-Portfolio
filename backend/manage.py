#!/usr/bin/env python
"""Django CLI boshqaruvchisi - Portfolio loyihasi"""

import os
import sys


def main():
    """Django sozlamalarini o'rnatish va CLI ni ishga tushirish"""
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django o'rnatilmagan yoki PYTHONPATH ga qo'shilmagan."
            "Django o'rnatish uchun: pip install django"
        ) from exc
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_project.settings')
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
