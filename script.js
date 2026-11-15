const usernameInput = document.querySelector("#usernameInput");
const searchBtn = document.querySelector("#searchBtn");
const status = document.querySelector("#status");
const result = document.querySelector("#result");
const retryBtn = document.querySelector("#retryBtn");

async function fetchData(url, onFinally) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP Error " + response.status);
    }
    return await response.json();
  } finally {
    
    onFinally();
  }
}

function showSkeleton() {
  result.innerHTML = `
    <div class="animate-pulse bg-white p-4 rounded shadow">
      <div class="h-20 w-20 bg-gray-300 rounded-full mb-4"></div>
      <div class="h-4 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>`;
}

function showCard(user) {
  result.innerHTML = `
    <div class="bg-white p-4 rounded shadow text-center">
      <img src="${user.avatar_url}" class="w-20 h-20 rounded-full mx-auto mb-2" />
      <h2 class="text-xl font-bold">${user.name || user.login}</h2>
      <p class="text-gray-500">@${user.login}</p>
      <p class="mt-2">${user.bio || "No bio"}</p>
      <p class="mt-2 text-sm">
        Repos: ${user.public_repos} |
        Followers: ${user.followers} |
        Following: ${user.following}
      </p>
    </div>`;
}

async function loadUser() {
  const username = usernameInput.value.trim();

  status.textContent = "Loading...";
  retryBtn.hidden = true;
  searchBtn.disabled = true;
  showSkeleton();

  try {
    const user = await fetchData(
      "https://api.github.com/users/" + username,
      () => {
        searchBtn.disabled = false;
        console.log("Request finished");
      }
    );

    status.textContent = "User loaded successfully";
    showCard(user);
  } catch (error) {
    console.log(error);
    result.innerHTML = "";
    status.textContent = "Something went wrong. Please try again.";
    retryBtn.hidden = false;
  }
}

searchBtn.addEventListener("click", loadUser);
retryBtn.addEventListener("click", loadUser);

loadUser();