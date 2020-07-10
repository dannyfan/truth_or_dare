(function() {
    var numInput = document.querySelector("#num_input");
    var numHelpText = document.querySelector("#num_input + .help");

    numInput.addEventListener("keyup", function() {
        var value = this.value;
        if (Number.parseInt(value)) {
            numInput.classList.remove("is-danger")
            numHelpText.style.display = "none";
        } else {
            numInput.classList.add("is-danger")
            numHelpText.style.display = "block";
        }
    });

    var showButton = document.querySelector("#show_questions");
    showButton.addEventListener("click", function() {
        if (!Number.parseInt(numInput.value)) {
            numHelpText.style.display = "block";
            return false
        }
        numHelpText.style.display = "none";
        var data = {
            number: numInput.value
        };

        var initial = document.querySelector("#initial");
        fetch("/questions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            initial.innerHTML = data;
        })

        document.body.addEventListener("click", function (event) {
            if (event.srcElement.classList.contains("next-question")) {
                var nextBtn = event.srcElement;
                var numID = nextBtn.dataset.value;
                var question = document.querySelector("#question_"+numID);
                question.remove();
            }

            if (event.srcElement.id === "download") {
                event.stopPropagation();
                var downloadBtn = document.querySelector("#download");
                var allQuestionsText = document.querySelector("#all-questions-text").textContent;
                downloadBtn.href = createQuestionFile(allQuestionsText);
            }
        });
    });

    function createQuestionFile(data) {
        var blob = new Blob([data], {type: "text/plain"});
        return window.URL.createObjectURL(blob);
    }
})()