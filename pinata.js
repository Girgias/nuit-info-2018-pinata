const pinataModalBoxId = 'pinataModalBox';
const fullscreenPinataId = 'fullscreenPinata';

// Konami code key sequence sequence to enter
const keySequence = [
	'ArrowUp',
	'ArrowUp',
	'ArrowDown',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowLeft',
	'ArrowRight',
	'b',
	'a'
];

let sequenceIndex = 0;

let isFound = false;
let nbHits = 0;
let isExploded = false;

// Launch after the document has loaded
window.onload = () => {
	document.addEventListener('keydown', function (keyDownProperties) {
		if (keyDownProperties.key === keySequence[sequenceIndex++]) {
			// If sequence is correctly entered, display the pinata
			if (sequenceIndex === keySequence.length) {
				showPinata();
				return false;
			}
		} else {
			sequenceIndex = 0;
		}
	});
};

function showPinata(){
	if (isFound) {
		return false;
	}

	insertPinataModalBox();
	let pinata = document.getElementById("pinata");
	pinata.style.backgroundImage = 'url("file:pinata.png")';
	pinata.style.backgroundPosition = 'top';
	pinata.style.marginTop = "-50px";

	let hitbox = document.createElement('div');
	hitbox.setAttribute('id', 'hitbox');
	hitbox.addEventListener('click', () => {
		if (isFound) {
			document.getElementById(pinataModalBoxId).style.display = "initial";
			pinata.style.backgroundImage = '';
		}
	});
	pinata.prepend(hitbox);

	// Update variables
	isFound = true;
	sequenceIndex = 0;
}

// Add modal box to document
function insertPinataModalBox(){
    let pinataModalBox = document.createElement('div');
    pinataModalBox.setAttribute('id', pinataModalBoxId);

    let fullscreenPinata = document.createElement('div');
    fullscreenPinata.setAttribute('id', fullscreenPinataId);
    fullscreenPinata.addEventListener('click', hitPinata);

    pinataModalBox.prepend(fullscreenPinata);

    document.body.prepend(pinataModalBox);
}

// Remove modal box
function removePinataModalBox() {
	document.getElementById(pinataModalBoxId).remove()
}

// Called when the fullscreen pinata is clicked
function hitPinata() {
	// For the pinata to explode it needs to be hit 10 times
	if (nbHits < 10) {
		// Pinata moves on every hit
		let fullscreenPinata = document.getElementById(fullscreenPinataId);
		fullscreenPinata.style.transform = "rotate("+0.02+"turn) translate("+ 20 +"px,0px)";
		setTimeout(function(){
			fullscreenPinata.style.transform = "rotate("+-0.02+"turn) translate("+ -20 +"px,0px)";
		}, 100);
		nbHits++;
	} else if(!isExploded) {
		// Throws confetti when the pinata explodes
		tremble();
		generateConfetti();
		isExploded = true;
		setTimeout(removePinataModalBox, 5000);
	}
}

// Tremble pinata
function tremble(){
	let fullscreenPinata = document.getElementById(fullscreenPinataId);
	setInterval(() => {
		let direction = rand(0, 3);
		let x = rand(15, 30);
		let y = rand(15, 30);

		// If direction equal 0, x&y negative
		// If direction equal 1, x&y positive
		// If direction equal 2, x negative & y positive
		// If direction equal 3, x positive 1 y negative
		if (direction % 2 === 0) {
			x = -x;
		}
		if (direction === (0 || 3)) {
			y = -y;
		}

		fullscreenPinata.style.transform = "translate("+ x +"px,"+ y +"px)";
	}, 15);
}

// Generate confetti for the explosion
function generateConfetti() {
    const container = document.createElement('div');
    container.setAttribute('id', 'pinataConfettiContainer');
    container.style.position = 'absolute';
    container.style.top = "0";
    container.style.left = "0";
    for (let i = 0; i < 400; i++) {
        let t = 1 + .01*rand(0, 100);
        // Creating the confetti as the specified element type
        const element = document.createElement('div');

        element.setAttribute("class", 'particle');
        element.style.transform = "translate(" + rand(0, 100) + "vw, " + rand(0, 100) + "vh)";
        element.style.background = "hsl(" + rand(0, 360) + ", 100%, 65%)";
        element.style.animationDuration = t + "s";
        element.style.animationDelay = -0.1*rand(0, 100)*t + "s";
        // Inserts the confetti into the container
        container.appendChild(element);
    }

    document.getElementById(pinataModalBoxId).appendChild(container);
}

// Random integer
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
