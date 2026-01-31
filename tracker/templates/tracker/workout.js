/**
 * workout.js - Tam Uyumlu & Hata Giderilmiş Versiyon
 */

// CSRF Token'ı almak için kapsamlı yardımcı fonksiyon
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    // Cookie yoksa HTML içindeki global değişkenden almayı dene
    return cookieValue || (typeof csrfToken !== 'undefined' ? csrfToken : null);
}

// Antrenman Programları Kütüphanesi
const programs = {
    'Push': {
        'Easy': [{name: 'Duvarda Şınav', sets: 3, reps: 10}, {name: 'Diz Üstü Şınav', sets: 2, reps: 10}],
        'Medium': [{name: 'Bench Press', sets: 3, reps: 10}, {name: 'Overhead Press', sets: 3, reps: 10}],
        'Hard': [{name: 'Barbell Bench Press', sets: 5, reps: 5}, {name: 'Weighted Dips', sets: 4, reps: 8}]
    },
    'Pull': {
        'Easy': [{name: 'Dumbbell Row', sets: 3, reps: 12}],
        'Medium': [{name: 'Barfiks', sets: 3, reps: 8}, {name: 'Seated Row', sets: 3, reps: 10}],
        'Hard': [{name: 'Weighted Pull-ups', sets: 4, reps: 6}, {name: 'Deadlift', sets: 5, reps: 5}]
    },
    'Legs': {
        'Easy': [{name: 'Bodyweight Squat', sets: 3, reps: 15}],
        'Medium': [{name: 'Barbell Squat', sets: 3, reps: 10}, {name: 'Leg Press', sets: 3, reps: 12}],
        'Hard': [{name: 'Back Squat', sets: 5, reps: 5}, {name: 'Bulgarian Split Squat', sets: 4, reps: 8}]
    },
    'FullBody': {
        'Easy': [{name: 'Şınav', sets: 3, reps: 10}, {name: 'Squat', sets: 3, reps: 10}],
        'Medium': [{name: 'Deadlift', sets: 3, reps: 10}, {name: 'Bench Press', sets: 3, reps: 10}],
        'Hard': [{name: 'Clean & Press', sets: 5, reps: 5}, {name: 'Burpees', sets: 4, reps: 15}]
    }
};

// Sayfa yüklendiğinde preset kontrolü yapar
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const preset = urlParams.get('preset');
    const level = urlParams.get('level') || 'Easy';

    if (preset && programs[preset] && programs[preset][level]) {
        const workoutInput = document.getElementById('workout-name');
        if (workoutInput) workoutInput.value = `${preset} (${level})`;
        programs[preset][level].forEach(item => fillPresetExercise(item.name, item.sets, item.reps));
    }
});

// Yeni bir hareket kartı ekler
function addExercise() {
    const container = document.getElementById('exercise-list');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'exercise-card card mb-3 p-3 bg-white border-start border-primary border-5 shadow-sm';
    div.style.borderRadius = "15px";
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <input type="text" class="form-control fw-bold ex-name border-0 fs-5" placeholder="Hareket Adı">
            <button type="button" class="btn btn-sm text-danger border-0" onclick="this.parentElement.parentElement.remove()">🗑️</button>
        </div>
        <div class="set-list container px-0"></div>
        <button type="button" class="btn btn-sm btn-light mt-2 fw-bold text-primary" onclick="addSet(this)">+ Set Ekle</button>
    `;
    container.appendChild(div);
}

// Seçili harekete yeni bir set satırı ekler
function addSet(btn) {
    const setList = btn.previousElementSibling;
    const setDiv = document.createElement('div');
    setDiv.className = 'row g-2 mb-2 set-row align-items-center';
    setDiv.innerHTML = `
        <div class="col-5">
            <div class="input-group input-group-sm">
                <input type="number" class="form-control weight" placeholder="kg">
                <span class="input-group-text bg-white border-start-0">kg</span>
            </div>
        </div>
        <div class="col-5">
            <div class="input-group input-group-sm">
                <input type="number" class="form-control reps" placeholder="tekrar">
                <span class="input-group-text bg-white border-start-0 text-muted">tekrar</span>
            </div>
        </div>
        <div class="col-2 text-end">
            <button type="button" class="btn btn-link btn-sm text-danger p-0" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    setList.appendChild(setDiv);
}

// Hazır programlardaki hareketleri ve setleri doldurur
function fillPresetExercise(name, setCounts, repsCount) {
    addExercise();
    const container = document.getElementById('exercise-list');
    const lastCard = container.lastElementChild;
    lastCard.querySelector('.ex-name').value = name;
    for(let i=0; i < setCounts; i++) {
        addSet(lastCard.querySelector('button[onclick="addSet(this)"]'));
        const lastRow = lastCard.querySelector('.set-list').lastElementChild;
        lastRow.querySelector('.reps').value = repsCount;
    }
}

// Tüm verileri toplayıp Django'ya gönderir
async function saveWorkout() {
    console.log("Kayıt işlemi başlatıldı...");

    const nameInput = document.getElementById('workout-name');
    const name = nameInput ? nameInput.value : "Yeni Antrenman";
    const data = { name: name, exercises: [] };
    const exerciseCards = document.querySelectorAll('.exercise-card');

    if (exerciseCards.length === 0) {
        alert("Lütfen önce bir hareket ekleyin!");
        return;
    }

    // --- Veri Toplama Mantığı ---
    exerciseCards.forEach(card => {
        const exName = card.querySelector('.ex-name').value;
        if (exName) {
            const ex = { name: exName, sets: [] };
            card.querySelectorAll('.set-row').forEach(row => {
                const w = row.querySelector('.weight').value;
                const r = row.querySelector('.reps').value;
                // Sayısal değerlerin güvenli gönderimi (Boşsa 0)
                ex.sets.push({
                    weight: parseFloat(w) || 0,
                    reps: parseInt(r) || 0
                });
            });
            data.exercises.push(ex);
        }
    });

    const token = getCookie('csrftoken');
    if (!token) {
        console.error("CSRF Token bulunamadı!");
        alert("Güvenlik hatası: CSRF Token eksik. Lütfen sayfayı yenileyin.");
        return;
    }

    try {
        console.log("Sunucuya gönderilen veri:", data);

        const res = await fetch('/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            console.log("Kayıt başarılı, ana sayfaya yönlendiriliyor...");
            // window.location.replace kullanmak yönlendirme geçmişini temizler
            window.location.replace("/");
        } else {
            const err = await res.json();
            console.error("Sunucu yanıt hatası:", err);
            alert("Hata: " + (err.message || "Kaydedilemedi. Lütfen tüm alanları kontrol edin."));
        }
    } catch (error) {
        console.error("Bağlantı/Ağ hatası:", error);
        alert("Sunucuya bağlanılamadı! İnternet bağlantınızı veya Django sunucunuzu kontrol edin.");
    }
}
