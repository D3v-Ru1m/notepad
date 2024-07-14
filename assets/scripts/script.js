let notes = [{
		title: "Bem-vindo!",
		content: "Isso é basicamente apenas https://westtle.github.io/simple-note/, mas com mais recursos. Agora você pode adicionar mais notas e removê-las se quiser.\n\nTambém há algumas ferramentas que você pode usar abaixo. Por exemplo, você pode colar da sua área de transferência, copiar, cortar, excluir e habilitar a quebra de linha.",
		id: 0,
		lastOpened: true
}];

// HTML.
const newTabButton = document.querySelector(".new-note_");
const noteTitleInput = document.querySelector("._title input");
const noteBody = document.querySelector("._body textarea");

function addTab() {

	// Criar nota e adicionar ao HTML.
	const newTab = document.createElement("button");
	newTab.classList.add("_tab");
	newTab.title = "Nova Nota"
	newTab.innerText = "Nova Nota";
	newTab.setAttribute("data-id", +new Date());
	newTab.setAttribute("data-open", "true");
	newTab.addEventListener("click", openTab);

	document.querySelector(".__tabs").insertBefore(newTab, newTabButton);

	// Adicionar um novo objeto de nota.
	const newNote = {
		title: "Nova Nota",
		content: "",
		id: newTab.dataset.id,
		lastOpened: true
	};

	notes.push(newNote);

	// Abrir a nova aba quando criada e salvar no armazenamento local.
	newTab.click();
	saveNote();

	noteTitleInput.select();
};

function openTab() {
	const tabs = document.querySelectorAll(".__tabs ._tab:not(._tab-tools)");
	const currentNote = notes.find(note => note.id == this.dataset.id);

	// Alterar o atributo data-open para "false" para todas as notas, exceto a atual para "true".
	tabs.forEach(tab => tab.dataset.open = "false");
	this.dataset.open = "true";

	// Atualizar o objeto de notas.
	notes.forEach(note => note.lastOpened = false);
	currentNote.lastOpened = true;

	// Alterar o título da nota e o textarea no DOM.
	noteTitleInput.value = currentNote.title;
	noteBody.value = currentNote.content;

	saveNote();
};

function saveNote() {
	let currentNote = document.querySelector("[data-open='true']");

	notes.find(note => {
		if (note.id == currentNote.dataset.id) {

			// Atualizar o objeto de notas.
			note.title = noteTitleInput.value;
			note.content = noteBody.value;

			// Atualizar o atributo title no DOM.
			currentNote.title = note.title;

			// Se o input do título estiver vazio, nomear a aba e o título no objeto de notas como "Sem Título".
			if (noteTitleInput.value == "") {
				note.title = "Sem Título";
				currentNote.textContent = "Sem Título";
				currentNote.title = "Sem Título";
			} else {
				currentNote.textContent = note.title;
			};
		
			// Salvar no Armazenamento Local.
			localStorage.setItem("Notes", JSON.stringify(notes));
		};
	});
};

function loadNotes() {
	const notesFromStorage = JSON.parse(localStorage.getItem("Notes"));
	notes = notesFromStorage || notes;
	
	const noteConfigFromStorage = JSON.parse(localStorage.getItem("Note Config"));
	noteConfig = noteConfigFromStorage || noteConfig;

	noteBody.style.fontSize = noteConfig.fontSize + "rem";
	noteBody.dataset.enableWrap = noteConfig.wordWrap;
	wrapButton.dataset.enableWrap = noteConfig.wordWrap;

	notes.forEach(note => {
		const newTab = document.createElement("button");
		newTab.classList.add("_tab");
		newTab.title = `${note.title}`;
		newTab.innerText = `${note.title}`;
		newTab.setAttribute("data-id", `${note.id}`);
		newTab.setAttribute("data-open", `${note.lastOpened}`);
		newTab.addEventListener("click", openTab);

		document.querySelector(".__tabs").insertBefore(newTab, newTabButton);
	});

	// Abrir a última aba selecionada.
	document.querySelector("[data-open='true']").click();
};

newTabButton.addEventListener("click", addTab);
noteTitleInput.addEventListener("input", () => {
	debouncedsaveNote();
	debouncedtoolMessage("Salvo...");
});
noteBody.addEventListener("input", () => {
	debouncedsaveNote();
	debouncedtoolMessage("Salvo...");
});

document.addEventListener("DOMContentLoaded", () => loadNotes());
