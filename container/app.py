import os

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from gigachat import GigaChat


app = Flask(__name__, static_folder="frontend")
CORS(app)


# Главная страница
@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")


# Раздача остальных файлов фронтенда:
# CSS, JS, картинки и т.д.
@app.route("/<path:path>")
def frontend_files(path):
    return send_from_directory("frontend", path)


# API для получения БЖУ
@app.route("/get-nutrition", methods=["POST"])
def get_nutrition():
    data = request.get_json(silent=True) or {}

    food_query = data.get("query", "").strip()

    if not food_query:
        return jsonify({
            "error": "Пустой запрос"
        }), 400

    prompt = (
        f"Напиши БЖУ для блюда: {food_query}. "
        "Напиши строго 3 строки цифрами (только числа): "
        "1 строка - белки, 2 - жиры, 3 - углеводы. "
        "Больше ничего не пиши, только эти 3 числа."
    )

    try:
        # Ключ берём из переменной окружения,
        # а не храним непосредственно в коде.
        credentials = os.environ.get("GIGACHAT_CREDENTIALS")

        if not credentials:
            return jsonify({
                "error": "Не задан GIGACHAT_CREDENTIALS"
            }), 500

        with GigaChat(
            credentials=credentials,
            scope="GIGACHAT_API_PERS",
            verify_ssl_certs=False,
            model="GigaChat-2",
        ) as client:

            response = client.chat.create(prompt)

            text = response.messages[0].content[0].text.strip()

            lines = [
                line.strip()
                for line in text.split("\n")
                if line.strip()
            ]

            if len(lines) >= 3:
                return jsonify({
                    "protein": float(lines[0]),
                    "fats": float(lines[1]),
                    "carbs": float(lines[2])
                })

            return jsonify({
                "error": "Некорректный ответ ИИ"
            }), 500

    except Exception as e:
        print(f"Ошибка: {e}")

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )