from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os
import tempfile
import subprocess
import shutil
import sys

load_dotenv()

app = Flask(__name__)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# =============================
# HOME PAGE
# =============================

@app.route("/")
def home():
    return render_template("index.html")


# =============================
# AI ASSISTANT
# =============================

@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "answer": "Please ask a question! 😊"
        })

    try:

       response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": (
                "You are a helpful AI Assistant for Students. "
                "Explain concepts clearly and simply. "
                "Help students learn and understand."
            )
        },
        {
            "role": "user",
            "content": question
        }
    ]
)

        return jsonify({
            "answer":response.choices[0].message.content
        })

    except Exception as error:

        print("AI Error:", error)

        return jsonify({
            "answer": "Sorry, I could not process your question. ❌"
        }), 500


# =============================
# PYTHON COMPILER
# =============================

@app.route("/run-python", methods=["POST"])
def run_python():

    data = request.get_json(silent=True) or {}
    code = data.get("code", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "output": "Please write some Python code."
        })

    file_path = None

    try:

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as file:

            file.write(code)
            file_path = file.name

        result = subprocess.run(
            [sys.executable, file_path],
            capture_output=True,
            text=True,
            timeout=5
        )

        output = result.stdout

        if result.stderr:
            output += result.stderr

        return jsonify({
            "output": output or "Code executed successfully."
        })

    except subprocess.TimeoutExpired:

        return jsonify({
            "output": "⏱️ Execution timed out."
        })

    except Exception as error:

        print("Python Error:", error)

        return jsonify({
            "output": "❌ Error: " + str(error)
        }), 500

    finally:

        if file_path and os.path.exists(file_path):
            os.remove(file_path)



# =============================
# JAVASCRIPT COMPILER
# =============================

@app.route("/run-javascript", methods=["POST"])
def run_javascript():

    data = request.get_json(silent=True) or {}
    code = data.get("code", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "output": "Please write some JavaScript code."
        })

    file_path = None

    try:

        node_path = shutil.which("node")

        if not node_path:
            return jsonify({
                "output": "❌ Node.js was not found."
            }), 500

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".js",
            delete=False,
            encoding="utf-8"
        ) as file:

            file.write(code)
            file_path = file.name

        result = subprocess.run(
            [node_path, file_path],
            capture_output=True,
            text=True,
            timeout=5
        )

        output = result.stdout

        if result.stderr:
            output += result.stderr

        return jsonify({
            "output": output or "✅ Code executed successfully."
        })

    except subprocess.TimeoutExpired:

        return jsonify({
            "output": "⏱️ Execution timed out."
        })

    except Exception as error:

        print("JavaScript Error:", error)

        return jsonify({
            "output": "❌ Error: " + str(error)
        }), 500

    finally:

        if file_path and os.path.exists(file_path):
            os.remove(file_path)

# =============================
# START APPLICATION
# =============================
# JAVA COMPILER
@app.route("/run-java", methods=["POST"])
def run_java():
    try:
        code = request.json.get("code", "")

        with tempfile.TemporaryDirectory() as temp_dir:
            java_file = os.path.join(temp_dir, "Main.java")

            with open(java_file, "w", encoding="utf-8") as file:
                file.write(code)

            # Compile Java
            compile_result = subprocess.run(
                ["javac", java_file],
                capture_output=True,
                text=True,
                timeout=5
            )

            if compile_result.returncode != 0:
                return jsonify({
                    "output": "❌ Compilation Error:\n\n" +
                              compile_result.stderr
                })

            # Run Java
            run_result = subprocess.run(
                ["java", "-cp", temp_dir, "Main"],
                capture_output=True,
                text=True,
                timeout=5
            )

            return jsonify({
                "output": run_result.stdout or run_result.stderr
            })

    except subprocess.TimeoutExpired:
        return jsonify({
            "output": "❌ Error: Execution timed out."
        }), 408

    except FileNotFoundError:
        return jsonify({
            "output": "❌ Java compiler not found. Check Java PATH."
        }), 500

    except Exception as error:
        return jsonify({
            "output": "❌ Backend Error:\n\n" + str(error)
        }), 500
if __name__ == "__main__":
    app.run(debug=True)
