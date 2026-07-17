"""
API URL routing - Portfolio loyihasi

Endpointlar:
- /api/profil/ - Profil ma'lumotlari
- /api/kategoriyalar/ - Ko'nikma kategoriyalari
- /api/konikmalar/ - Ko'nikmalar
- /api/loyihalar/ - Loyihalar
- /api/loyihalar/<id>/ - Bitta loyiha
- /api/github-loyihalar/ - GitHub loyihalari
- /api/github-statistika/ - GitHub statistikasi
- /api/xabar/ - Xabar yuborish
- /api/sozlamalar/ - Sayt sozlamalari
- /api/tillar/ - Tillar
"""

from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Profil
    path('profil/', views.ProfilView.as_view(), name='profil'),
    
    # Ko'nikmalar
    path('kategoriyalar/', views.SkillCategoryView.as_view(), name='kategoriyalar'),
    path('konikmalar/', views.SkillView.as_view(), name='konikmalar'),
    
    # Loyihalar
    path('loyihalar/', views.ProjectView.as_view(), name='loyihalar'),
    path('loyihalar/<int:pk>/', views.LoyihaDetailView.as_view(), name='loyiha_detail'),
    
    # GitHub
    path('github-loyihalar/', views.GitHubProjectsView.as_view(), name='github_loyihalar'),
    path('github-statistika/', views.GitHubStatsView.as_view(), name='github_statistika'),
    
    # Xabar
    path('xabar/', views.ContactMessageView.as_view(), name='xabar'),
    
    # Sayt sozlamalari
    path('sozlamalar/', views.SiteSettingsView.as_view(), name='sozlamalar'),
    
    # Tillar
    path('tillar/', views.til_ozgartirish, name='tillar'),
]
