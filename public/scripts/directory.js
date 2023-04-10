/*jshint esversion: 6 */
(function () {
	'use strict';
	window.onload = () => {
		let xhr = new XMLHttpRequest();
		xhr.onload = () => {
			let data = JSON.parse(xhr.responseText);
			if (data.error) return document.body.innerHTML = `Something went wrong!?<br><br>Error Code: ${data.error.code}<br>Reason: ${data.error.reason}`;
			for (let i = 0; i < data.rooms.length; i++) {
				let BroadcastingNow = 0, query = "", room_name = data.rooms[ i ].room.replace(/^tinychat\^/gi, "").toUpperCase();
				data.rooms[ i ].users.sort((c, a) => ((a.oper ? 1 : 0) - (c.oper ? 1 : 0) || (a.broadcasting ? 1 : 0) - (c.broadcasting ? 1 : 0) || c.nick.toLowerCase().localeCompare(a.nick.toLowerCase())));

				for (let x = 0; x < data.rooms[ i ].users.length; x++) {
					if (data.rooms[ i ].users[ x ].broadcasting) BroadcastingNow++;
					query += `<div class="user">${(data.rooms[ i ].users[ x ].oper) ? "<img class=\"operator\" src=\"styles/images/moderator.svg\" title=\"User is a moderator.\"></img>" : ""}${(data.rooms[ i ].users[ x ].broadcasting) ? "<img class=\"broadcasting\" src=\"styles/images/camera.svg\" title=\"Users is currently broadcasting.\"></img>" : ""}<div class="nick">${data.rooms[ i ].users[ x ].nick}</div></div>`;
				}

				let roomdiv = CreateElement("div", [ "class", "room" ], room_name);
				roomdiv.appendChild(CreateElement("div", [ "class", "description" ], `<a href=\"${location.protocol}//${location.host}/room/${room_name}\" class=\"GoToNow\">LINK</a><img class=\"broadcasting\" src=\"styles/images/camera.svg\" title="Users broadcasting in the room currently."></img> <p>${BroadcastingNow}</p><img class=\"totalusers\" src=\"styles/images/viewer.svg\" title="Users in the room currently."></img><p>${data.rooms[ i ].total_users}</p>`));
				roomdiv.appendChild(CreateElement("div", [ "class", "users" ], query));
				document.getElementById("main-wrapper").appendChild(roomdiv);
			}
		};
		xhr.open("GET", "/api/get-rooms");
		xhr.send();

		document.getElementById("jump-top").addEventListener("click", () => window.scrollTo(0, 0), { passive: true });
	};

	let CreateElement = (type, attribute, HTML) => {
		let elem = document.createElement(type);
		elem.setAttribute(attribute[ 0 ], attribute[ 1 ]);
		elem.innerHTML = HTML;

		return elem;
	};
})();