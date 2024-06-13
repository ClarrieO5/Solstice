var messages = [
    "Welcome to Solstice!",
    "Browse the web securely with Solstice.",
    "Access blocked content easily!",
    "Made by @screwedover1",
    "Protect your privacy online.",
    "Solstice - Your gateway to the internet!",
    "Fast, free, and reliable web proxy."
];

var quotes = [
    '"I want a shoot out" - Onyc.',
    '"Ohio skibidi gyatt rizzler" - casen.',
    '"To eat or not to eat, that is the question." - Yeti1o1'
];

function displayRandomMessage() {
    var randomIndex = Math.floor(Math.random() * messages.length);
    document.getElementById("random-message").textContent = messages[randomIndex];
}

function displayRandomQuote() {
    var randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("random-quote").textContent = quotes[randomIndex];
}

document.getElementById("uv-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var searchText = document.getElementById("uv-address").value;
    if (isValidURL(searchText)) {
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(searchText.startsWith("http") ? searchText : "https://" + searchText);
    } else {
        var searchEngine = document.getElementById("uv-search-engine").value;
        var searchUrl = searchEngine.replace("%s", encodeURIComponent(searchText));
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(searchUrl);
    }
});

function isValidURL(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
}

displayRandomMessage();
displayRandomQuote();
