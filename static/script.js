document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // PAGE NAVIGATION
    // =========================

    const navLinks = document.querySelectorAll("[data-page]");
    const pages = document.querySelectorAll(".page-section");
    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.getElementById("menuBtn");

    function showPage(pageId) {

        pages.forEach(function (page) {
            page.classList.remove("active");
        });

        const selectedPage = document.getElementById(pageId);

        if (selectedPage) {
            selectedPage.classList.add("active");
        }

        navLinks.forEach(function (link) {
            link.classList.remove("active");

            if (link.dataset.page === pageId &&
                link.classList.contains("nav-link")) {

                link.classList.add("active");
            }
        });

        if (sidebar) {
            sidebar.classList.remove("show");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const pageId = link.dataset.page;

            if (pageId) {
                showPage(pageId);
            }

        });

    });


    // =========================
    // MOBILE MENU
    // =========================

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", function () {
            sidebar.classList.toggle("show");
        });

    }


    // =========================
    // AI CHAT
    // =========================

    const askBtn = document.getElementById("askBtn");
    const aiQuestion = document.getElementById("aiQuestion");
    const responseText = document.getElementById("responseText");
    const chatHistory = document.getElementById("chatHistory");
    const clearChatBtn = document.getElementById("clearChatBtn");
    const downloadChatBtn = document.getElementById("downloadChatBtn");

    let chats = [];

    if (askBtn) {

        askBtn.addEventListener("click", async function () {

            const question = aiQuestion.value.trim();

            if (!question) {
                responseText.textContent = "Please enter a question.";
                return;
            }

            askBtn.disabled = true;
            askBtn.textContent = "Thinking...";

            responseText.textContent = "Please wait...";

            try {

                const response = await fetch("/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: question
                    })
                });

                const data = await response.json();

                const answer = data.answer ||
                               data.response ||
                               "No answer received.";

                responseText.textContent = answer;

                chats.push({
                    question: question,
                    answer: answer
                });

                updateChatHistory();

            } catch (error) {

                responseText.textContent =
                    "Something went wrong. Please try again.";

                console.error(error);

            } finally {

                askBtn.disabled = false;
                askBtn.textContent = "Ask AI";

            }

        });

    }


    function updateChatHistory() {

        if (!chatHistory) return;

        if (chats.length === 0) {
            chatHistory.textContent = "No chat history yet.";
            return;
        }

        chatHistory.innerHTML = "";

        chats.forEach(function (chat) {

            const message = document.createElement("div");

            message.className = "chat-message";

            const question = document.createElement("strong");
            question.textContent = "You: " + chat.question;

            const answer = document.createElement("p");
            answer.textContent = "AI: " + chat.answer;

            message.appendChild(question);
            message.appendChild(answer);

            chatHistory.appendChild(message);

        });

    }


    if (clearChatBtn) {

        clearChatBtn.addEventListener("click", function () {

            chats = [];

            updateChatHistory();

            if (responseText) {
                responseText.textContent =
                    "Your answer will appear here.";
            }

        });

    }

     // =========================
// DOWNLOAD CHAT HISTORY
// =========================

if (downloadChatBtn) {

    downloadChatBtn.addEventListener("click", function () {

        if (chats.length === 0) {

            alert("No chat history available to download.");
            return;

        }

        let historyText = "STUDENT HUB - CHAT HISTORY\n";
        historyText += "============================\n\n";

        chats.forEach(function (chat, index) {

            historyText += "Chat " + (index + 1) + "\n";
            historyText += "You: " + chat.question + "\n";
            historyText += "AI: " + chat.answer + "\n\n";
            historyText += "----------------------------\n\n";

        });

        const file = new Blob(
            [historyText],
            { type: "text/plain" }
        );

        const downloadUrl = URL.createObjectURL(file);

        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "StudentHub_Chat_History.txt";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(downloadUrl);

    });

}
    // =========================
    // VOICE INPUT
    // =========================

    const voiceBtn = document.getElementById("voiceBtn");

    if (voiceBtn && "webkitSpeechRecognition" in window) {

        const recognition = new webkitSpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceBtn.addEventListener("click", function () {

            recognition.start();

        });

        recognition.onresult = function (event) {

            const text = event.results[0][0].transcript;

            aiQuestion.value = text;

        };

    } else if (voiceBtn) {

        voiceBtn.disabled = true;
        voiceBtn.title = "Voice input is not supported in this browser.";

    }


    // =========================
    // ASSIGNMENT HELPER
    // =========================

    const assignmentBtn = document.getElementById("assignmentBtn");

    if (assignmentBtn) {

        assignmentBtn.addEventListener("click", function () {

            const question =
                document.getElementById("assignmentQuestion").value.trim();

            const result =
                document.getElementById("assignmentResponse");

            if (!question) {
                result.textContent = "Please enter your assignment question.";
                return;
            }

            result.textContent =
                "Your assignment question is ready. You can ask AI Chat for detailed assistance.";

        });

    }


    // =========================
    // CGPA CALCULATOR
    // =========================

    const addGpaBtn = document.getElementById("addGpaBtn");
    const semesterGpa = document.getElementById("semesterGpa");
    const gpaList = document.getElementById("gpaList");
    const cgpaResult = document.getElementById("cgpaResult");

    let gpas = [];

    if (addGpaBtn) {

        addGpaBtn.addEventListener("click", function () {

            const gpa = Number(semesterGpa.value);

            if (semesterGpa.value === "" ||
                gpa < 0 ||
                gpa > 10) {

                gpaList.textContent =
                    "Please enter a GPA between 0 and 10.";

                return;
            }

            gpas.push(gpa);

            semesterGpa.value = "";

            displayGpa();

        });

    }


    function displayGpa() {

        gpaList.innerHTML = "";

        gpas.forEach(function (gpa, index) {

            const line = document.createElement("div");

            line.textContent =
                "Semester " + (index + 1) + ": " + gpa.toFixed(2);

            gpaList.appendChild(line);

        });

        if (gpas.length > 0) {

            const total = gpas.reduce(function (sum, value) {
                return sum + value;
            }, 0);

            const cgpa = total / gpas.length;

            cgpaResult.textContent =
                "CGPA: " + cgpa.toFixed(2);

        } else {

            cgpaResult.textContent = "CGPA: 0.00";

        }

    }


    // ===============================
// PERFORMANCE ANALYSIS
// ===============================

let performanceSubjects = [];

const addPerformanceBtn =
    document.getElementById("addPerformanceBtn");

const calculatePerformanceBtn =
    document.getElementById("calculatePerformanceBtn");

function getPerformanceGrade(percentage) {

    if (percentage >= 91) return "S";
    if (percentage >= 81) return "A+";
    if (percentage >= 71) return "A";
    if (percentage >= 61) return "B+";
    if (percentage >= 56) return "B";
    if (percentage >= 51) return "C";

    return "U";
}

function getPerformanceLevel(percentage) {

    if (percentage >= 91) return "Outstanding";
    if (percentage >= 81) return "Excellent";
    if (percentage >= 71) return "Very Good";
    if (percentage >= 61) return "Good";
    if (percentage >= 51) return "Average";

    return "Needs Improvement";
}

function displayPerformanceSubjects() {

    const list = document.getElementById(
        "performanceSubjectList"
    );

    list.innerHTML = "";

    performanceSubjects.forEach(function (item, index) {

        const percentage =
            (item.obtained / item.total) * 100;

        const grade = getPerformanceGrade(percentage);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.subject}</td>
            <td>${item.obtained}</td>
            <td>${item.total}</td>
            <td>${percentage.toFixed(2)}%</td>
            <td>${grade}</td>
            <td>
                <button class="danger-btn"
                    onclick="deletePerformanceSubject(${index})">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(row);

    });

    document.getElementById(
        "performanceSubjectCount"
    ).textContent = performanceSubjects.length;

    document.getElementById(
        "performanceEmptyMessage"
    ).style.display =
        performanceSubjects.length === 0 ? "block" : "none";
}

if (addPerformanceBtn) {

    addPerformanceBtn.addEventListener("click", function () {

        const subject = document.getElementById(
            "performanceSubject"
        ).value.trim();

        const obtained = Number(
            document.getElementById("marksObtained").value
        );

        const total = Number(
            document.getElementById("totalMarks").value
        );

        if (!subject || !total ||
            obtained < 0 || total <= 0 ||
            obtained > total) {

            alert("Please enter valid subject marks.");
            return;

        }

        performanceSubjects.push({
            subject: subject,
            obtained: obtained,
            total: total
        });

        displayPerformanceSubjects();

        document.getElementById(
            "performanceSubject"
        ).value = "";

        document.getElementById(
            "marksObtained"
        ).value = "";

        document.getElementById(
            "totalMarks"
        ).value = "";

    });

}

function deletePerformanceSubject(index) {

    performanceSubjects.splice(index, 1);

    displayPerformanceSubjects();

}

if (calculatePerformanceBtn) {

    calculatePerformanceBtn.addEventListener(
        "click",
        function () {

            if (performanceSubjects.length === 0) {

                alert("Please add at least one subject.");
                return;

            }

            let obtainedTotal = 0;
            let marksTotal = 0;

            performanceSubjects.forEach(function (item) {

                obtainedTotal += item.obtained;
                marksTotal += item.total;

            });

            const percentage =
                (obtainedTotal / marksTotal) * 100;

            const grade = getPerformanceGrade(percentage);

            const level = getPerformanceLevel(percentage);

            document.getElementById(
                "performanceTotalMarks"
            ).textContent =
                obtainedTotal + " / " + marksTotal;

            document.getElementById(
                "performanceAverage"
            ).textContent =
                percentage.toFixed(2) + "%";

            document.getElementById(
                "performanceLevel"
            ).textContent = level;

            document.getElementById(
                "performanceGrade"
            ).textContent = grade;

            document.getElementById(
                "performancePercentage"
            ).textContent =
                Math.round(percentage) + "%";

            document.getElementById(
                "performanceInsight"
            ).textContent =
                "Your performance level is " + level +
                ". Keep learning and improving!";

        }
    );

}

displayPerformanceSubjects();

    // =========================
    // CODING ASSISTANT
    // =========================

    const codingBtn = document.getElementById("codingBtn");

    if (codingBtn) {

        codingBtn.addEventListener("click", function () {

            const question =
                document.getElementById("codingQuestion").value.trim();

            const result =
                document.getElementById("codingResponse");

            if (!question) {

                result.textContent =
                    "Please enter your coding question.";

                return;
            }

            result.textContent =
                "Your coding question is ready. Use AI Chat for detailed coding assistance.";

        });

    }

});
// ===============================
// FUTURISTIC ASSIGNMENT MANAGER
// ===============================

let studentAssignments = JSON.parse(
    localStorage.getItem("studentAssignments") || "[]"
);

let currentAssignmentFilter = "all";

const assignmentTitle = document.getElementById("assignmentTitle");
const assignmentSubject = document.getElementById("assignmentSubject");
const assignmentDate = document.getElementById("assignmentDate");
const assignmentPriority = document.getElementById("assignmentPriority");
const addAssignmentBtn = document.getElementById("addAssignmentBtn");

const assignmentList = document.getElementById("assignmentList");

function saveAssignments() {
    localStorage.setItem(
        "studentAssignments",
        JSON.stringify(studentAssignments)
    );
}

function escapeAssignmentText(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

function isAssignmentOverdue(assignment) {
    if (assignment.completed || !assignment.date) {
        return false;
    }

    return new Date(assignment.date + "T23:59:59") < new Date();
}

function updateAssignmentStats() {

    const total = studentAssignments.length;

    const completed = studentAssignments.filter(
        assignment => assignment.completed
    ).length;

    const pending = total - completed;

    const overdue = studentAssignments.filter(
        assignment => isAssignmentOverdue(assignment)
    ).length;

    document.getElementById("totalAssignments").textContent = total;
    document.getElementById("pendingAssignments").textContent = pending;
    document.getElementById("completedAssignments").textContent = completed;
    document.getElementById("overdueAssignments").textContent = overdue;
}

function renderAssignments() {

    updateAssignmentStats();

    let filteredAssignments = studentAssignments.filter(assignment => {

        if (currentAssignmentFilter === "pending") {
            return !assignment.completed;
        }

        if (currentAssignmentFilter === "completed") {
            return assignment.completed;
        }

        if (currentAssignmentFilter === "overdue") {
            return isAssignmentOverdue(assignment);
        }

        return true;
    });

    if (filteredAssignments.length === 0) {

        assignmentList.innerHTML = `
            <p class="empty-assignment">
                No assignments found. 🚀
            </p>
        `;

        return;
    }

    assignmentList.innerHTML = filteredAssignments.map(assignment => {

        const overdue = isAssignmentOverdue(assignment);

        return `
            <div class="neon-card" style="margin-bottom:15px;">

                <h3>
                    ${escapeAssignmentText(assignment.title)}
                </h3>

                <p>
                    Subject:
                    ${escapeAssignmentText(assignment.subject)}
                </p>

                <p>
                    Due Date: ${assignment.date || "Not set"}
                </p>

                <p>
                    Priority: ${escapeAssignmentText(assignment.priority)}
                </p>

                <p>
                    Status:
                    ${
                        assignment.completed
                        ? "✅ Completed"
                        : overdue
                        ? "🔴 Overdue"
                        : "🟡 Pending"
                    }
                </p>

                <button
                    class="neon-button"
                    onclick="toggleAssignmentStatus(${assignment.id})"
                >
                    ${
                        assignment.completed
                        ? "↩ Mark Pending"
                        : "✓ Mark Completed"
                    }
                </button>

                <button
                    class="neon-button"
                    onclick="deleteAssignment(${assignment.id})"
                >
                    🗑 Delete
                </button>

            </div>
        `;

    }).join("");
}

if (addAssignmentBtn) {

    addAssignmentBtn.addEventListener("click", function () {

        const title = assignmentTitle.value.trim();
        const subject = assignmentSubject.value.trim();
        const date = assignmentDate.value;
        const priority = assignmentPriority.value;

        if (!title || !subject || !date) {

            alert("Please fill in all assignment details.");
            return;

        }

        const newAssignment = {

            id: Date.now(),
            title: title,
            subject: subject,
            date: date,
            priority: priority,
            completed: false

        };

        studentAssignments.push(newAssignment);

        saveAssignments();

        assignmentTitle.value = "";
        assignmentSubject.value = "";
        assignmentDate.value = "";
        assignmentPriority.value = "Medium";

        renderAssignments();

        alert("Assignment added successfully! ⚡");

    });

}

function toggleAssignmentStatus(id) {

    studentAssignments = studentAssignments.map(assignment => {

        if (assignment.id === id) {
            assignment.completed = !assignment.completed;
        }

        return assignment;

    });

    saveAssignments();
    renderAssignments();
}

function deleteAssignment(id) {

    const confirmDelete = confirm(
        "Do you want to delete this assignment?"
    );

    if (!confirmDelete) {
        return;
    }

    studentAssignments = studentAssignments.filter(
        assignment => assignment.id !== id
    );

    saveAssignments();
    renderAssignments();
}

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function () {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentAssignmentFilter = this.dataset.filter;

        renderAssignments();

    });

});

renderAssignments();
// ===============================
// CGPA CALCULATOR
// ===============================

let cgpaSubjects = [];

const addSubjectBtn = document.getElementById("addSubjectBtn");
const calculateCgpaBtn = document.getElementById("calculateCgpaBtn");

if (addSubjectBtn) {

    addSubjectBtn.addEventListener("click", function () {

        const subject = document.getElementById("cgpaSubject").value.trim();
        const credits = Number(document.getElementById("cgpaCredits").value);
        const gradeSelect = document.getElementById("cgpaGrade");

        const grade = gradeSelect.options[gradeSelect.selectedIndex].text;
        const points = Number(gradeSelect.value);

        if (!subject || !credits || !points) {
            alert("Please fill all subject details.");
            return;
        }

        cgpaSubjects.push({
            subject: subject,
            credits: credits,
            grade: grade,
            points: points
        });

        displayCgpaSubjects();

        document.getElementById("cgpaSubject").value = "";
        document.getElementById("cgpaCredits").value = "";
        gradeSelect.value = "";

    });

}

function displayCgpaSubjects() {

    const subjectList = document.getElementById("cgpaSubjectList");

    subjectList.innerHTML = "";

    cgpaSubjects.forEach(function (item, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.subject}</td>
            <td>${item.credits}</td>
            <td>${item.grade}</td>
            <td>${item.points}</td>
            <td>
                <button class="danger-btn"
                    onclick="deleteCgpaSubject(${index})">
                    Delete
                </button>
            </td>
        `;

        subjectList.appendChild(row);

    });

}

function deleteCgpaSubject(index) {

    cgpaSubjects.splice(index, 1);

    displayCgpaSubjects();

}

if (calculateCgpaBtn) {

    calculateCgpaBtn.addEventListener("click", function () {

        if (cgpaSubjects.length === 0) {
            alert("Please add at least one subject.");
            return;
        }

        let totalCredits = 0;
        let totalPoints = 0;

        cgpaSubjects.forEach(function (item) {

            totalCredits += item.credits;
            totalPoints += item.credits * item.points;

        });

        const cgpa = totalPoints / totalCredits;

        document.getElementById("cgpaResult").textContent =
            "CGPA: " + cgpa.toFixed(2);

    });

}
/* ============================= */
/* ONLINE COMPILER JAVASCRIPT */
/* ============================= */

const languageSelect = document.getElementById("programmingLanguage");
const codeEditor = document.getElementById("codeEditor");
const runCodeBtn = document.getElementById("runCodeBtn");
const clearCodeBtn = document.getElementById("clearCodeBtn");
const codeOutput = document.getElementById("codeOutput");

// Run Code

runCodeBtn.addEventListener("click", async function () {

    const language = languageSelect.value;
    const code = codeEditor.value.trim();

    if (code === "") {
        codeOutput.textContent = "⚠️ Please write some code first.";
        return;
    }

    // JavaScript Compiler
    if (language === "javascript") {

        let output = [];
        const originalLog = console.log;
        const originalError = console.error;

        try {

            console.log = function (...args) {
                output.push(
                    args.map(arg =>
                        typeof arg === "object"
                            ? JSON.stringify(arg)
                            : String(arg)
                    ).join(" ")
                );
            };

            console.error = function (...args) {
                output.push(
                    "❌ Error: " +
                    args.map(arg => String(arg)).join(" ")
                );
            };

            // Execute JavaScript code
            Function(
                `"use strict";\n${code}`
            )();

            codeOutput.textContent =
                output.length > 0
                    ? output.join("\n")
                    : "✅ Code executed successfully.";

        } catch (error) {

            codeOutput.textContent =
                "❌ JavaScript Error:\n\n" +
                error.name + ": " +
                error.message;

        } finally {

            // Restore console functions
            console.log = originalLog;
            console.error = originalError;

        }

        return;
    }
    // HTML

    if (language === "html") {

        const previewWindow = window.open(
            "",
            "_blank"
        );

        if (previewWindow) {
            previewWindow.document.open();
            previewWindow.document.write(code);
            previewWindow.document.close();

            codeOutput.textContent =
                "✅ HTML preview opened in a new tab.";
        } else {
            codeOutput.textContent =
                "⚠️ Please allow pop-ups to preview HTML.";
        }

        return;
    }

    // CSS

    if (language === "css") {

        const previewWindow = window.open(
            "",
            "_blank"
        );

        if (previewWindow) {

            previewWindow.document.open();

            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>${code}</style>
                </head>
                <body>
                    <h1>CSS Preview</h1>
                    <p>Customize your styles!</p>
                </body>
                </html>
            `);

            previewWindow.document.close();

            codeOutput.textContent =
                "✅ CSS preview opened in a new tab.";

        } else {

            codeOutput.textContent =
                "⚠️ Please allow pop-ups to preview CSS.";

        }

        return;
    }
    // Python Execution

    if (language === "python") {

        codeOutput.textContent = "⏳ Running Python...";

        fetch("/run-python", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code
            })
        })

        .then(response => response.json())

        .then(data => {

            codeOutput.textContent =
                data.output || "No output.";

        })

        .catch(error => {

            codeOutput.textContent =
                "❌ Error connecting to Python compiler.";

            console.error(error);

        });

        return;
    }
    // JAVA COMPILER API
if (language === "java") {

    codeOutput.textContent = "⏳ Compiling Java code...";

    try {

        const response = await fetch("/run-java", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code
            })
        });

        const data = await response.json();

        codeOutput.textContent =
            data.output || "✅ Code executed successfully.";

    } catch (error) {

        codeOutput.textContent =
            "❌ Backend Error:\n\n" + error.message;

    }

    return;
}
    // C++ Execution

    if (language === "cpp") {

        codeOutput.textContent = "⏳ Compiling C++...";

        fetch("/run-cpp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code
            })
        })

        .then(response => response.json())

        .then(data => {

            codeOutput.textContent =
                data.output || "No output.";

        })

        .catch(error => {

            codeOutput.textContent =
                "❌ Error connecting to C++ compiler.";

            console.error(error);

        });

        return;
    }

    // Other Languages

    codeOutput.textContent =
        "ℹ️ " + language.toUpperCase() +
        " execution requires a backend compiler API.";

});

// Clear Code

clearCodeBtn.addEventListener("click", function () {

    codeEditor.value = "";

    codeOutput.textContent =
        "Output will appear here...";

});