import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .models import Workout, Exercise, ExerciseSet

def index(request):
    """Antrenmanları tarih sırasına göre (en yeni en üstte) çeker."""
    if request.user.is_authenticated:
        # related_name kullanarak tüm alt verileri (hareketler ve setler) tek seferde çekiyoruz
        workouts = Workout.objects.filter(user=request.user).prefetch_related('exercises__sets').order_by('-date')
    else:
        workouts = []
    return render(request, "tracker/index.html", {"workouts": workouts})

def workout_detail(request, workout_type):
    """Antrenman seçiminden sonraki sayaç ve hareket listesi sayfası."""
    level = request.GET.get('level', 'Easy')
    return render(request, "tracker/workout_detail.html", {"type": workout_type, "level": level})

def create_workout(request):
    """Verileri kaydeder ve başarılıysa sinyal gönderir."""
    if request.method == "POST":
        try:
            # Kullanıcı oturum açmamışsa işlemi engelle
            if not request.user.is_authenticated:
                return JsonResponse({"status": "error", "message": "Lütfen giriş yapın."}, status=403)

            data = json.loads(request.body)
            # Antrenman başlığını oluştur (Örn: Push (Easy))
            workout = Workout.objects.create(
                user=request.user,
                name=data.get("name", "Yeni Antrenman")
            )

            # Dinamik olarak gelen hareketleri ve setleri döngüyle kaydet
            for ex_item in data.get("exercises", []):
                ex_name = ex_item.get("name")
                if not ex_name:
                    continue

                exercise = Exercise.objects.create(workout=workout, name=ex_name)

                for s in ex_item.get("sets", []):
                    # Sayısal verilerin güvenli dönüşümü (Hata payını sıfırlamak için)
                    try:
                        w_val = float(s.get("weight") or 0)
                        r_val = int(s.get("reps") or 0)
                    except (ValueError, TypeError):
                        w_val, r_val = 0, 0

                    ExerciseSet.objects.create(
                        exercise=exercise,
                        weight=w_val,
                        reps=r_val
                    )

            return JsonResponse({"status": "success", "workout_id": workout.id}, status=201)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return render(request, "tracker/create.html")

@require_POST
def delete_workout(request, workout_id):
    """Belirli bir antrenmanı veritabanından siler."""
    if not request.user.is_authenticated:
        return JsonResponse({"status": "error", "message": "Yetkisiz işlem."}, status=403)

    # Sadece kullanıcının kendi antrenmanını silmesini sağla
    workout = get_object_or_404(Workout, id=workout_id, user=request.user)
    workout.delete()
    return JsonResponse({"status": "success"})
