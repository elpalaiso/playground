(function(){
  "use strict";

  var script = document.currentScript;
  var targets = Array.prototype.slice.call(document.querySelectorAll("[data-build-meta]"));
  if(!script || !targets.length) return;

  var style = document.createElement("style");
  style.textContent =
    ".build-meta{margin-top:12px;color:var(--build-meta-color,currentColor);opacity:.62;" +
    "font:600 10px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;" +
    "font-variant-numeric:tabular-nums;letter-spacing:0;text-align:center}" +
    ".build-meta code,.build-meta time{font:inherit;color:inherit}";
  document.head.appendChild(style);

  function formatKst(value){
    var date = new Date(value);
    if(Number.isNaN(date.getTime())) return "시간 확인 불가";
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone:"Asia/Seoul",
      year:"numeric",
      month:"2-digit",
      day:"2-digit",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hourCycle:"h23"
    }).formatToParts(date);
    var map = {};
    parts.forEach(function(part){ map[part.type] = part.value; });
    return map.year + "-" + map.month + "-" + map.day + " " +
      map.hour + ":" + map.minute + ":" + map.second + " KST";
  }

  function render(label, sha, builtAt, fullSha){
    targets.forEach(function(target){
      var prefix = document.createElement("span");
      var code = document.createElement("code");
      var divider = document.createElement("span");
      var time = document.createElement("time");

      prefix.textContent = label + " ";
      code.textContent = sha;
      code.title = fullSha || sha;
      divider.textContent = " · ";
      time.textContent = formatKst(builtAt);
      time.dateTime = builtAt;

      target.replaceChildren(prefix, code, divider, time);
    });
  }

  var versionUrl = new URL("version.json", script.src);
  versionUrl.searchParams.set("refresh", Date.now().toString());

  fetch(versionUrl.href, { cache:"no-store" })
    .then(function(response){
      if(!response.ok) throw new Error("version response " + response.status);
      return response.json();
    })
    .then(function(data){
      var fullSha = String(data.commit || "");
      if(!/^[0-9a-f]{40}$/i.test(fullSha)) throw new Error("invalid deploy sha");
      render("DEPLOY", fullSha.slice(0,7), data.builtAt, fullSha);
    })
    .catch(function(){
      render("LOCAL", "worktree", document.lastModified, "GitHub Pages 배포 정보 없음");
    });
})();
