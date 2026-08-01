(function() {
    //DOM
    const video = document.getElementById('museumVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const seekSlider = document.getElementById('seekSlider');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const volumeSlider = document.getElementById('volumeSlider');

    //background track)
    const bgAudio = new Audio();
    // Museum ambience sound
    bgAudio.src = "audio/ambience sound.mp3";
    bgAudio.loop = true;
    bgAudio.volume = 0.3;
    let isAudioUserEnabled = false;
    const originalAudioVolume = 0.3;

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioStateLabel = document.getElementById('audioStateLabel');

    //audio duck
    function duckAudioForVideo() {
        if (isAudioUserEnabled && !bgAudio.paused) {
            bgAudio.volume = 0.05;
        }
    }

    function restoreAudioVolumeAfterVideo() {
        if (isAudioUserEnabled && !bgAudio.paused) {
            bgAudio.volume = originalAudioVolume;
        }
    }

    function handleVideoPlay() {
        duckAudioForVideo();
        playPauseBtn.textContent = '⏸ PAUSE';
    }

    function handleVideoPause() {
        restoreAudioVolumeAfterVideo();
        playPauseBtn.textContent = '▶ PLAY';
    }

    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('ended', () => {
        restoreAudioVolumeAfterVideo();
        playPauseBtn.textContent = '▶ PLAY';
    });

    //video controls
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }

    video.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(video.duration);
        seekSlider.max = video.duration;
    });

    video.addEventListener('timeupdate', () => {
        currentTimeDisplay.textContent = formatTime(video.currentTime);
        if (!isNaN(video.duration)) {
            seekSlider.value = video.currentTime;
        }
    });

    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play().catch(e => console.warn("Video play failed:", e));
        } else {
            video.pause();
        }
    });

    seekSlider.addEventListener('input', (e) => {
        const seekTime = parseFloat(e.target.value);
        video.currentTime = seekTime;
        currentTimeDisplay.textContent = formatTime(seekTime);
    });

    volumeSlider.addEventListener('input', (e) => {
        video.volume = parseFloat(e.target.value);
    });

    video.volume = 0.7;
    volumeSlider.value = 0.7;

    // AUDIO TOGGLE
    audioToggleBtn.addEventListener('click', function() {
        if (isAudioUserEnabled) {
            bgAudio.pause();
            isAudioUserEnabled = false;
            audioToggleBtn.textContent = "🔊 PLAY AUDIO";
            audioStateLabel.innerText = "Museum soundscape (OFF)";
        } else {
            bgAudio.play().then(() => {
                isAudioUserEnabled = true;
                audioToggleBtn.textContent = "🔇 MUTE AUDIO";
                audioStateLabel.innerText = "Museum ambience: ACTIVE 🎵";
                if (!video.paused && !video.ended) {
                    duckAudioForVideo();
                } else {
                    bgAudio.volume = originalAudioVolume;
                }
            }).catch(error => {
                console.error("Audio play error:", error);
                alert("Click OK then try the audio button again. Browser requires user interaction first.");
            });
        }
    });

    //INTERACTIVE IMAGE GALLERY
    
    const galleryItems = [
        {
            src: "images/Dials.jpeg",
            alt: "Rotary dial telephone collection at MMU ICT Museum",
            caption: "Early Communication Devices - Dial Telephone Exhibition (1950s)"
        },
        {
            src: "images/electro magnetism.jpeg",
            alt: "Electromagnetic exhibit - MMU ICT Museum",
            caption: "Electromagnetic Evolution: From Switchboards to Smartphones"
        },
        {
            src: "images/teleprompter.jpeg",
            alt: "First generation mechanical teleprompter set at ICT Museum",
            caption: "Broadcast Technology: The Dawn of Television"
        },
        {
            src: "images/communication booth.jpeg",
            alt: "Historic communication center - MMU ICT Museum",
            caption: "Telecommunication Milestones: From Telegraph to Mobile Networks"
        },
        {
            src: "images/communication images.jpeg",
            alt: "Signal controls and peripherals",
            caption: "Communication Technology: Evolution of Signal Processing"
        },
        {
            src: "images/typewriter.jpeg",
            alt: "Vintage typewriter exhibit at MMU ICT Museum",
            caption: "Typewriting Technology: The Mechanical Age of Writing"
        }
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    const featuredImage = document.getElementById('featuredImage');
    const featuredCaption = document.getElementById('featuredCaption');

    function renderGallery() {
        galleryGrid.innerHTML = '';
        galleryItems.forEach((item) => {
            const galleryDiv = document.createElement('div');
            galleryDiv.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            img.loading = 'lazy';
            galleryDiv.appendChild(img);
            galleryDiv.addEventListener('click', () => {
                featuredImage.src = item.src;
                featuredImage.alt = item.alt;
                featuredCaption.innerHTML = `${item.caption}`;
            });
            galleryGrid.appendChild(galleryDiv);
        });
        if (galleryItems.length) {
            featuredImage.src = galleryItems[0].src;
            featuredCaption.innerHTML = `${galleryItems[0].caption} — Click any image to view details`;
        }
    }

    renderGallery();

    // Console instructions
    console.log('%c📸 MMU ICT MUSEUM - LAYOUT 1 (HERO LAYOUT)', 'color: #4ECDC4; font-size: 14px; font-weight: bold;');
    console.log('%cVideo at top (full width), Gallery at bottom', 'color: #45B7D1;');
    console.log('%cTo add your own photos:', 'color: #FFD700;');
    console.log('1. Create an "images" folder in your project directory');
    console.log('2. Update the "src" URLs in galleryItems array to point to your images');
    console.log('   Example: src: "images/vintage-radio.jpg"');
    console.log('%c✅ Layout 1 ready!', 'color: #00ff88;');

    // Fallback for older browsers
    if (!HTMLVideoElement.prototype.play || !window.Audio) {
        const fallbackMsg = document.createElement('div');
        fallbackMsg.className = 'fallback-note';
        fallbackMsg.style.marginTop = '10px';
        fallbackMsg.style.background = '#4f3e2e';
        fallbackMsg.style.color = '#ffefcf';
        fallbackMsg.style.padding = '8px';
        fallbackMsg.style.borderRadius = '12px';
        fallbackMsg.style.textAlign = 'center';
        fallbackMsg.style.fontSize = '0.7rem';
        fallbackMsg.innerHTML = '⚠️ Your browser does not support modern video/audio features. Please upgrade for full exhibit experience.';
        document.querySelector('.video-section').appendChild(fallbackMsg);
    }

    video.addEventListener('error', () => {
        const errDiv = document.createElement('div');
        errDiv.style.background = '#4f3e2e';
        errDiv.style.color = '#ffefcf';
        errDiv.style.padding = '8px';
        errDiv.style.borderRadius = '12px';
        errDiv.style.marginTop = '8px';
        errDiv.style.textAlign = 'center';
        errDiv.style.fontSize = '0.7rem';
        errDiv.innerText = '📽️ Video alternative: Museum reel unavailable, but gallery and audio sync remain active.';
        document.querySelector('.video-wrapper')?.appendChild(errDiv);
    });
})();