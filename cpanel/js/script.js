      const DEMO = {
        users: [
          { id: 1, name: "Ayesha Khan", email: "ayesha@example.com", resumes: 3, blocked: false },
          { id: 2, name: "Bilal Ahmad", email: "bilal@example.com", resumes: 1, blocked: false },
          { id: 3, name: "Sana Malik", email: "sana@example.com", resumes: 7, blocked: false },
          { id: 4, name: "Umar Farooq", email: "umar@example.com", resumes: 0, blocked: false }
        ],
        templates: [
          { id: 1, title: "Modern CV", image: "https://images.unsplash.com/photo-1587116987928-21e47bd76cd2?q=80&w=1470", uses:45 },
          { id: 2, title: "Creative Resume", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800", uses:32 },
          { id: 3, title: "Minimalist", image: "https://images.unsplash.com/photo-1623667322051-18662ce6334c?q=80&w=774", uses:18 },
          { id: 4, title: "Professional", image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=800", uses:25 }
        ],
        feedbacks: [
          { id: 1, name: "Ali", email: "ali@mail.com", message: "Great tool! Helped me land an interview." },
          { id: 2, name: "Zara", email: "zara@mail.com", message: "Please add Urdu language support." }
        ],
        activities: [
          "Ayesha created a resume using Modern CV",
          "Bilal signed up",
          "Sana uploaded a new photo to profile",
          "Umar requested password reset"
        ],
        payments: [
          { id: 1, userId: 1, amount: 9.99, date: "2025-10-01", status: "Paid" },
          { id: 2, userId: 3, amount: 19.99, date: "2025-10-10", status: "Pending" }
        ],
        settings: {
          title: "ProgresCV",
          tagline: "Build resumes that get interviews",
          logo: "favicon/nav_logo.png",
          accent: "#6d2a7a",
          dark: false
        }
      };
      function loadState() {
        const state = JSON.parse(localStorage.getItem("pcv_admin_v1"));
        if (state) return state;
        localStorage.setItem("pcv_admin_v1", JSON.stringify(DEMO));
        return JSON.parse(JSON.stringify(DEMO));
      }
      function saveState(state) {
        localStorage.setItem("pcv_admin_v1", JSON.stringify(state));
      }
      let state = loadState();
      let users = state.users;
      let templates = state.templates;
      let feedbacks = state.feedbacks;
      let activities = state.activities;
      let payments = state.payments;
      let settings = state.settings;
      function applySettingsToUI() {
        document.getElementById("siteTitle").value = settings.title;
        document.getElementById("siteTagline").value = settings.tagline || "";
        document.getElementById("siteLogo").value = settings.logo || "";
        document.getElementById("siteAccent").value = settings.accent || "#6d2a7a";
        document.getElementById("settingsDark").checked = !!settings.dark;
        document.getElementById("navLogo").src = settings.logo || "favicon/nav_logo.png";
        document.documentElement.style.setProperty("--accent", settings.accent || "#6d2a7a");
        if (settings.dark) document.body.classList.add("dark"); else document.body.classList.remove("dark");
      }
      function renderUsers() {
        const tbody = document.querySelector("#usersTable tbody");
        tbody.innerHTML = "";
        users.forEach((u) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${u.resumes}</td>
            <td class="actions">
              <button class="btn btn-ghost" onclick="viewUser(${u.id})"><i class='fa-solid fa-eye'></i></button>
              <button class="btn btn-ghost" onclick="openEditUser(${u.id})">${u.blocked ? "<i class='fa-solid fa-ban'></i> Unblock" : "<i class='fa-solid fa-user-slash'></i> Block"}</button>
              <button class="btn btn-ghost" onclick="deleteUser(${u.id})"><i class='fa-solid fa-trash'></i></button>
            </td>`;
          tbody.appendChild(tr);
        });
        document.getElementById("totalUsers").innerText = users.length;
      }
      function renderTemplates() {
        const grid = document.getElementById("templatesGrid");
        grid.innerHTML = "";
        templates.forEach((t) => {
          const div = document.createElement("div");
          div.className = "template-card card";
          div.innerHTML = `<img src="${t.image}" alt="${t.title}" /><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
            <div><strong>${t.title}</strong><div class='small'>Uses: ${t.uses}</div></div>
            <div>
              <button class='btn btn-ghost' onclick='previewTemplate(${t.id})'><i class="fa-solid fa-eye"></i></button>
              <button class='btn btn-ghost' onclick='editTemplate(${t.id})'><i class="fa-solid fa-pen"></i></button>
              <button class='btn btn-ghost' onclick='deleteTemplate(${t.id})'><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>`;
          grid.appendChild(div);
        });
        const totalRes = templates.reduce((s,t)=>s+t.uses,0);
        document.getElementById("totalResumes").innerText = totalRes;
        const most = templates.slice().sort((a,b)=>b.uses-a.uses)[0];
        document.getElementById("mostUsed").innerText = most ? `${most.title} (${most.uses})` : "-";
      }
      function renderFeedback() {
        const tbody = document.querySelector("#feedbackTable tbody");
        tbody.innerHTML = "";
        feedbacks.forEach((f)=> {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${f.name}</td><td>${f.email}</td><td>${f.message}</td><td><button class='btn btn-ghost' onclick='deleteFeedback(${f.id})'><i class="fa-solid fa-trash"></i></button></td>`;
          tbody.appendChild(tr);
        });
      }
      function renderActivities() {
        const ul = document.getElementById("recentList");
        ul.innerHTML = "";
        activities.slice(0, 10).forEach((a)=> {
          const li = document.createElement("li");
          li.innerText = a;
          ul.appendChild(li);
        });
      }
      function renderPayments() {
        const tbody = document.querySelector("#paymentsTable tbody");
        tbody.innerHTML = "";
        payments.forEach((p)=> {
          const user = users.find(u=>u.id===p.userId) || {name:"Unknown"};
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${user.name}</td><td>$${p.amount.toFixed(2)}</td><td>${p.date}</td><td>${p.status}</td>
            <td>
              <button class="btn btn-ghost" onclick="openEditPayment(${p.id})"><i class='fa-solid fa-pen'></i></button>
              <button class="btn btn-ghost" onclick="deletePayment(${p.id})"><i class='fa-solid fa-trash'></i></button>
            </td>`;
          tbody.appendChild(tr);
        });
        document.getElementById("totalPayments").innerText = payments.length;
      }
      let usageChart;
      function drawChart() {
        const ctx = document.getElementById("usageChart").getContext("2d");
        const labels = templates.map((t) => t.title);
        const data = templates.map((t) => t.uses);
        if (usageChart) usageChart.destroy();
        usageChart = new Chart(ctx, {
          type: "bar",
          data: { labels, datasets: [{ label: "Template uses", data }] },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
          },
        });
      }
      function showModal(html, width = 760) {
        document.getElementById("modalContent").innerHTML = html;
        const card = document.querySelector("#modal .card");
        card.style.width = width + "px";
        document.getElementById("modal").style.display = "flex";
      }
      function closeModal() {
        document.getElementById("modal").style.display = "none";
      }
      document.getElementById("modalClose").addEventListener("click", closeModal);
      function viewUser(id) {
        const u = users.find(x => x.id === id);
        showModal(`<h3>User details</h3>
          <p><strong>${u.name}</strong><br/>${u.email}<br/>Resumes: ${u.resumes}</p>
          <div style="margin-top:8px"><button class="btn btn-primary" onclick="openEditUser(${u.id})">Edit User</button></div>`);
      }
      function openEditUser(id) {
        const u = users.find(x=>x.id===id);
        showModal(`<h3>Edit User</h3>
          <label>Name</label><input id="editUserName" value="${u.name}" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Email</label><input id="editUserEmail" value="${u.email}" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Resumes</label><input id="editUserResumes" value="${u.resumes}" type="number" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <div style="text-align:right;margin-top:8px"><button class="btn btn-primary" onclick="saveUser(${u.id})">Save</button></div>`);
      }
      function saveUser(id) {
        const u = users.find(x=>x.id===id);
        u.name = document.getElementById("editUserName").value || u.name;
        u.email = document.getElementById("editUserEmail").value || u.email;
        u.resumes = parseInt(document.getElementById("editUserResumes").value||0,10);
        saveAll();
        renderUsers();
        closeModal();
        addActivity("User updated");
      }
      function deleteUser(id) {
        if (!confirm("Delete this user?")) return;
        const idx = users.findIndex(u=>u.id===id);
        if (idx>-1) users.splice(idx,1);
        payments = payments.filter(p=>p.userId !== id);
        saveAll();
        renderUsers(); renderPayments();
        addActivity("User deleted");
      }
      function openAddUserForm() {
        showModal(`<h3>Add User</h3>
          <label>Name</label><input id="newUserName" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Email</label><input id="newUserEmail" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Resumes</label><input id="newUserResumes" type="number" value="0" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <div style="text-align:right;margin-top:8px"><button class="btn btn-primary" onclick="createUser()">Create</button></div>`);
      }
      function createUser() {
        const name = document.getElementById("newUserName").value || "Unnamed";
        const email = document.getElementById("newUserEmail").value || "noemail@demo";
        const resumes = parseInt(document.getElementById("newUserResumes").value || 0,10);
        const id = Date.now();
        users.unshift({id, name, email, resumes, blocked:false});
        saveAll();
        renderUsers();
        closeModal();
        addActivity("New user added");
      }
      function previewTemplate(id) {
        const t = templates.find(x=>x.id===id);
        showModal(`<h3>${t.title}</h3><img src='${t.image}' style='width:100%;height:260px;object-fit:cover;border-radius:8px;margin-top:8px'><p class='small' style='margin-top:8px'>Uses: ${t.uses}</p>`);
      }
      function deleteTemplate(id) {
        if (!confirm("Delete this template?")) return;
        const idx = templates.findIndex(t=>t.id===id);
        if (idx>-1) templates.splice(idx,1);
        saveAll();
        renderTemplates();
        addActivity("Template deleted");
      }
      function editTemplate(id) {
        const t = templates.find(x=>x.id===id);
        showModal(`<h3>Edit Template</h3>
        <label>Title</label><input id='editTitle' value='${t.title}' style='width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)' />
        <label style='margin-top:8px;display:block'>Image URL</label><input id='editImg' value='${t.image}' style='width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)' />
        <label style='margin-top:8px;display:block'>Uses</label><input id='editUses' value='${t.uses}' type="number" style='width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)' />
        <div style='text-align:right;margin-top:8px'><button class='btn btn-primary' onclick='saveTemplate(${id})'>Save</button></div>
      `);
      }
      function saveTemplate(id) {
        const t = templates.find(x=>x.id===id);
        t.title = document.getElementById("editTitle").value || t.title;
        t.image = document.getElementById("editImg").value || t.image;
        t.uses = parseInt(document.getElementById("editUses").value||0,10);
        saveAll();
        renderTemplates();
        closeModal();
        addActivity("Template updated");
      }
      function createTemplate() {
        const title = document.getElementById("newTitle").value || "Untitled";
        const img = document.getElementById("newImg").value || "https://via.placeholder.com/400x200";
        const id = Date.now();
        templates.unshift({ id, title, image: img, uses: 0 });
        saveAll();
        renderTemplates();
        closeModal();
        addActivity("New template added");
      }
      function deleteFeedback(id) {
        if (!confirm("Delete feedback?")) return;
        const idx = feedbacks.findIndex(f=>f.id===id);
        if (idx>-1) feedbacks.splice(idx,1);
        saveAll();
        renderFeedback();
        addActivity("Feedback deleted");
      }
      function openAddPayment() {
        const userOptions = users.map(u=>`<option value="${u.id}">${u.name} (${u.email})</option>`).join("");
        showModal(`<h3>Add Payment</h3>
          <label>User</label><select id="payUser">${userOptions}</select>
          <label style="margin-top:8px;display:block">Amount (USD)</label><input id="payAmount" type="number" step="0.01" value="9.99" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Date</label><input id="payDate" type="date" value="${new Date().toISOString().slice(0,10)}" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Status</label><select id="payStatus"><option>Paid</option><option>Pending</option><option>Failed</option></select>
          <div style="text-align:right;margin-top:8px"><button class="btn btn-primary" onclick="createPayment()">Create</button></div>
        `);
      }
      function openEditPayment(id) {
        const p = payments.find(x=>x.id===id);
        const userOptions = users.map(u=>`<option value="${u.id}" ${u.id===p.userId?'selected':''}>${u.name} (${u.email})</option>`).join("");
        showModal(`<h3>Edit Payment</h3>
          <label>User</label><select id="payUser">${userOptions}</select>
          <label style="margin-top:8px;display:block">Amount (USD)</label><input id="payAmount" type="number" step="0.01" value="${p.amount}" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Date</label><input id="payDate" type="date" value="${p.date}" style="width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)"/>
          <label style="margin-top:8px;display:block">Status</label><select id="payStatus"><option ${p.status==="Paid"?'selected':''}>Paid</option><option ${p.status==="Pending"?'selected':''}>Pending</option><option ${p.status==="Failed"?'selected':''}>Failed</option></select>
          <div style="text-align:right;margin-top:8px"><button class="btn btn-primary" onclick="savePayment(${p.id})">Save</button></div>
        `);
      }
      function createPayment() {
        const userId = parseInt(document.getElementById("payUser").value,10);
        const amount = parseFloat(document.getElementById("payAmount").value) || 0;
        const date = document.getElementById("payDate").value || new Date().toISOString().slice(0,10);
        const status = document.getElementById("payStatus").value;
        const id = Date.now();
        payments.unshift({ id, userId, amount, date, status });
        saveAll(); renderPayments(); closeModal(); addActivity("Payment added");
      }
      function savePayment(id) {
        const p = payments.find(x=>x.id===id);
        p.userId = parseInt(document.getElementById("payUser").value,10);
        p.amount = parseFloat(document.getElementById("payAmount").value)||0;
        p.date = document.getElementById("payDate").value || p.date;
        p.status = document.getElementById("payStatus").value;
        saveAll(); renderPayments(); closeModal(); addActivity("Payment updated");
      }
      function deletePayment(id) {
        if (!confirm("Delete payment?")) return;
        const idx = payments.findIndex(p=>p.id===id);
        if (idx>-1) payments.splice(idx,1);
        saveAll(); renderPayments(); addActivity("Payment deleted");
      }
      function saveSettings() {
        settings.title = document.getElementById("siteTitle").value || settings.title;
        settings.tagline = document.getElementById("siteTagline").value || "";
        settings.logo = document.getElementById("siteLogo").value || settings.logo;
        settings.accent = document.getElementById("siteAccent").value || settings.accent;
        settings.dark = document.getElementById("settingsDark").checked;
        applySettingsToUI();
        saveAll();
        addActivity("Settings updated");
        alert("Settings saved (frontend demo)");
      }

      function resetDemo() {
        if (!confirm("Reset demo data to defaults? This will overwrite current demo data.")) return;
        localStorage.removeItem("pcv_admin_v1");
        state = loadState();
        users = state.users; templates = state.templates; feedbacks = state.feedbacks; activities = state.activities; payments = state.payments; settings = state.settings;
        applySettingsToUI(); renderAll();
        addActivity("Demo data reset");
      }

      function addActivity(txt) {
        activities.unshift(`${new Date().toLocaleString()}: ${txt}`);
        // keep to 50
        if (activities.length > 50) activities.length = 50;
        saveAll();
        renderActivities();
      }

      function saveAll() {
        state = { users, templates, feedbacks, activities, payments, settings };
        saveState(state);
      }

      document.getElementById("search").addEventListener("input", (e)=>{
        const q = e.target.value.toLowerCase();
        if (!q) { renderUsers(); renderTemplates(); return; }
        const utbody = document.querySelector("#usersTable tbody");
        utbody.innerHTML = "";
        users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).forEach(u=>{
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${u.resumes}</td><td><button class='btn btn-ghost' onclick='viewUser(${u.id})'>View</button></td>`;
          utbody.appendChild(tr);
        });
        const grid = document.getElementById("templatesGrid");
        grid.innerHTML = "";
        templates.filter(t=>t.title.toLowerCase().includes(q)).forEach((t)=> {
          const div = document.createElement("div");
          div.className = "template-card card";
          div.innerHTML = `<img src='${t.image}'/><div style='margin-top:8px;display:flex;justify-content:space-between;align-items:center'><div><strong>${t.title}</strong><div class='small'>Uses: ${t.uses}</div></div><div><button class='btn btn-ghost' onclick='previewTemplate(${t.id})'>Preview</button></div></div>`;
          grid.appendChild(div);
        });
      });
      document.querySelectorAll("[data-section]").forEach(a=>{
        a.addEventListener("click", (e)=>{
          e.preventDefault();
          const target = a.dataset.section;
          document.querySelectorAll(".section").forEach(s=> s.style.display = "none");
          document.getElementById(target).style.display = "block";
        });
      });

      document.getElementById("toggleSidebar").addEventListener("click", ()=> {
        const nav = document.querySelector("nav.sidebar");
        nav.style.display = nav.style.display === "none" ? "block" : "none";
      });

      const darkToggle = document.getElementById("darkToggle");
      darkToggle.addEventListener("click", ()=> {
        document.body.classList.toggle("dark");
        settings.dark = document.body.classList.contains("dark");
        saveAll();
      });

      document.getElementById("settingsDark").addEventListener("change", (e)=> {
        if (e.target.checked) document.body.classList.add("dark"); else document.body.classList.remove("dark");
      });

      document.getElementById("saveSettings").addEventListener("click", saveSettings);
      document.getElementById("resetDemo").addEventListener("click", resetDemo);
      document.getElementById("openAddTemplate").addEventListener("click", ()=> {
        showModal(`<h3>Add Template</h3>
          <label>Title</label><input id='newTitle' style='width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)' />
          <label style='margin-top:8px;display:block'>Image URL</label><input id='newImg' style='width:100%;padding:8px;margin-top:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.06)' />
          <div style='text-align:right;margin-top:8px'><button class='btn btn-primary' onclick='createTemplate()'>Create</button></div>`);
      });

      document.getElementById("openAddUser").addEventListener("click", openAddUserForm);
      document.getElementById("addUserTop").addEventListener("click", openAddUserForm);
      document.getElementById("openAddPayment").addEventListener("click", openAddPayment);
      document.getElementById("addPaymentTop").addEventListener("click", openAddPayment);
      document.getElementById("refreshData").addEventListener("click", ()=> { renderAll(); addActivity("Data refreshed"); });
      function renderAll() {
        applySettingsToUI();
        renderUsers();
        renderTemplates();
        renderFeedback();
        renderActivities();
        renderPayments();
        drawChart();
      }
      renderAll();
