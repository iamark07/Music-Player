// using jQuery

$(document).ready(() => {

    // serach box open and close function

    $(".search").click(() => {
        $(".search_input_container").addClass("show_search_box");
    });

    $(".close_search_icon").click(() => {
        $(".search_input_container").removeClass("show_search_box");
        $(".search_input_box").val("");
    });

    // empty search box
    $(".empty_search_icon").click(() => {
        $(".search_input_box").val("").focus();
    });

    // popup music show and hide
    $(".popup_cur_music").click(() => {
        $(".popup_cur_music_container").addClass("hide_pop_music");
        $(".current_music_container").addClass("show_pop_up_music");
    });

    $(".popup_cur_music_container").click((event) => { // there is problem in same time in one div popup_cur_music_container 2 click event swipe_down_music under the divpopup_cur_music_container div then it's not remove class normaly 
        let tar = event.target;
        if ($(tar).hasClass("swipe_down_music")) {
            $(".popup_cur_music_container").removeClass("hide_pop_music");
            $(".current_music_container").removeClass("show_pop_up_music");
        }
    });

    // remove current_song_list class
    function removeSongClass() {
        $(".song").removeClass("current_song_list");
    };

    function creat_wave_icon() {
        const play_wave_icon = $(".play_wave_icon");
        const creat_music_wave_img = $("<img>");
        play_wave_icon.append(creat_music_wave_img);
        $(".current_song_list .song_name .play_wave_icon img").attr("src", "/assets/img/music wave.gif");
    };

    // remove wave img tag
    function delWaveIcon() {
        $(".play_wave_icon img").remove();
    };

    // song path name show in song name
    $('.song').each(function () {
        const audio = $(this).find('.audio');
        const audioSrc = audio.find('source').attr('src');
        const audioName = decodeURIComponent(audioSrc.split('/').pop()); // Decode URL-encoded characters
        const h4Tag = $(this).find('.audio_name');
        h4Tag.text(audioName); // Set the text content of the <h4> tag to the audio file name

        // show current song name in popup song and current song
        $(this).click(() => {
            removeSongClass();
            $(this).addClass("current_song_list");
            let pop_song_name = $(".current_song_list .song_name .audio_name").text();
            $(".pop_cur_song_name").text(pop_song_name);
            let cur_song_name = $(".pop_cur_song_name").text();
            $(".cur_song_name").text(cur_song_name);

            updateCurrentTime();
            music_duration();
            progress();
            progress_bar_point();
            song_end();

            // popup play and puase btn show and hide and current song play and puase btn show and hide
            play_music_action();


            $(".audio").each(function () {
                if (!this.paused) {
                    this.pause();
                    this.currentTime = 0;
                }
            });

            // change current song change_cur_song hold same value like cur_audio but cur_audio always return first song

            let change_cur_song = $(".current_song_list .song_name .audio")[0];
            change_cur_song.play();


            delWaveIcon();// delete music wave gif img
            creat_wave_icon();// add music wave gif img
        });


        // show current song name in popup song and current song
        let pop_song_name = $(".current_song_list .song_name .audio_name").text();
        $(".pop_cur_song_name").text(pop_song_name);
        let cur_song_name = $(".pop_cur_song_name").text();
        $(".cur_song_name").text(cur_song_name);

    });

    function play_music_action() {
        $(".play_btn").addClass("hide_play_btn");
        $(".pause_btn").addClass("show_pause_btn");
        $(".current_song_list .song_name .play_wave_icon img").attr("src", "/assets/img/music wave.gif");
        $(".cd_player img").addClass("play_cd");
    }

    function stop_music_action() {
        $(".play_btn").removeClass("hide_play_btn");
        $(".pause_btn").removeClass("show_pause_btn");
        $(".current_song_list .song_name .play_wave_icon img").attr("src", "/assets/img/stop music wave.jpg");
        $(".cd_player img").removeClass("play_cd");
    }


    // popup play and puase btn show and hide and current song play and puase btn show and hide
    $(".play_btn").click((pop_play) => {
        pop_play.stopPropagation(); // this is use for when i click on play btn then popup music page is not open 
        play_music_action();
        $(".audio").each(function () {
            if (!this.paused) {
                this.pause();
                this.currentTime = 0;
            }
        });
        updateCurrentTime();
        play_cur_song = $(".current_song_list .song_name .audio")[0];
        play_cur_song.play();
        progress();

    });
    $(".pause_btn").click((pop_pause) => {
        pop_pause.stopPropagation();// this is use for when i click on pause btn then popup music page is not open 
        stop_music_action();
        pause_cur_song = $(".current_song_list .song_name .audio")[0];
        pause_cur_song.pause();
    });


    // song duration and current time show 
    function music_duration() {

        let song_duration = $(".song_duration");
        let cur_song_time = $(".current_song_list .song_name .audio")[0];
        $(cur_song_time).each(function () {

            var duration = this.duration;
            var minutes = Math.floor(duration / 60);
            var seconds = Math.floor(duration % 60);
            var durationString = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
            $(song_duration).text(durationString);
            // console.log(this.duration);
        });
        cur_song_time.onloadedmetadata = function () {
            music_duration();
        }
    }
    music_duration();

    function updateCurrentTime() {
        let current_song_time = $(".current_song_time");
        let cur_song_time = $(".current_song_list .song_name .audio")[0];

        // Function to update the current time display
        function setCurrentTime() {
            // Update the current time whenever the time of the audio file updates
            $(cur_song_time).on('timeupdate', function () {
                if (!isNaN(cur_song_time.currentTime)) {
                    var currentTime = cur_song_time.currentTime;
                    var minutes = Math.floor(currentTime / 60);
                    var seconds = Math.floor(currentTime % 60);
                    var currentTimeString = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
                    current_song_time.text(currentTimeString);
                }
            });
        }

        // Update the current time immediately if metadata is already loaded
        if (cur_song_time.readyState >= 2) {
            setCurrentTime();
        } else {
            // Otherwise, wait for the metadata to be loaded
            cur_song_time.onloadedmetadata = setCurrentTime;
        }
    };

    // Call the updateCurrentTime function
    updateCurrentTime();




    // progress
    function progress() {
        let cur_progress_audio = $(".current_song_list .song_name .audio")[0];
        let progress_icon = $(".progress");
        cur_progress_audio.ontimeupdate = function () {
            let percentage = Math.floor(cur_progress_audio.currentTime * 100 / cur_progress_audio.duration); // song currenttime divide by song duration and multiply by 100 to get a percentage number
            let leftValue = percentage * 0.95; // Adjusted to 95% of the total width
            progress_icon.css("left", leftValue + "%");
        };
    }
    progress();

    // stop click event on progress becuase it's efect of is left style value

    $(".progress").click((eve) => {
        eve.stopPropagation();
    });

    // in progress where we click song duration will change function

    function progress_bar_point() {
        // song_end();
        cur_progress_audio = $(".current_song_list .song_name .audio")[0];
        let progress_bar_box = $(".progress_song_box");
        $(progress_bar_box).click(function (eve) {
            if (!isNaN(cur_progress_audio.duration) && cur_progress_audio.duration > 0) {
                $(".audio").each(function () {
                    if (!$(this).is(cur_progress_audio)) {
                        this.pause();
                    }
                });
                cur_progress_audio.currentTime = ((eve.offsetX / progress_bar_box.width()) * cur_progress_audio.duration);
                cur_progress_audio.play();

                play_music_action();
            }
        });
        updateCurrentTime();
    }
    progress_bar_point();


    function song_end() {
        // when song ended 

        cur_audio = $(".current_song_list .song_name .audio")[0];
        $(cur_audio).on('ended', function () {

            $(".current_song_list").addClass("stop_song"); // add class stop_song in current_song_list 
            removeSongClass(); // remove all current_song_list class 
            let next = $(".stop_song").next(); // select next sibling of stop_song class
            $(next).addClass("current_song_list"); // then add current_song_list class in next sibling element 

            if ($(".song:last").hasClass("stop_song")) { // check if last song have class stop_song name then 
                $(".song:last").removeClass("stop_song"); // remove stop_song from last song
                $(".song:first").addClass("current_song_list"); // add current_song_list class on first song
            }

            let prev = $(".current_song_list").prev(); // select current_song_list previous song
            prev.removeClass("stop_song"); // remove stop_song class on current_song_list privious song
            let next_cur_song = $(".current_song_list .song_name .audio")[0]; // select current song

            $(".audio").each(function () {
                if (!this.paused) { // check which song who am i select is play then
                    this.pause(); // current song paused
                    this.currentTime = 0; //and set song current time to 0
                }
            });
            next_cur_song.play(); // current song play
            let pop_song_name = $(".current_song_list .song_name .audio_name").text(); // pop up song name select
            $(".pop_cur_song_name").text(pop_song_name); // copy to popup current song
            let cur_song_name = $(".pop_cur_song_name").text(); //  select current popup song
            $(".cur_song_name").text(cur_song_name); // copy to popup song name
            delWaveIcon();// delete music wave gif img
            creat_wave_icon();// add music wave gif img
            song_end();
            updateCurrentTime();
            music_duration(); // music duration show
            play_music_action(); // other music action cd animation play pause btn show hide
            progress(); // progess moving automatic with the song duration 
            progress_bar_point(); // on progress bar where click song playing there
        });
    }

    // song_end();

    // next previous song functionalty

    $(".right_arrow").click((eve) => {

        eve.stopPropagation(); // stop when i click on arrow then current pop music is open 

        $(".current_song_list").addClass("stop_song"); // add class stop_song in current_song_list 
        removeSongClass(); // remove all current_song_list class 
        let next = $(".stop_song").next(); // select next sibling of stop_song class
        $(next).addClass("current_song_list"); // then add current_song_list class in next sibling element 

        if ($(".song:last").hasClass("stop_song")) { // check if last song have class stop_song name then 
            $(".song:last").removeClass("stop_song"); // remove stop_song from last song
            $(".song:first").addClass("current_song_list"); // add current_song_list class on first song
        }

        let prev = $(".current_song_list").prev(); // select current_song_list previous song
        prev.removeClass("stop_song"); // remove stop_song class on current_song_list privious song
        let next_cur_song = $(".current_song_list .song_name .audio")[0]; // select current song

        $(".audio").each(function () {
            if (!this.paused) { // check which song who am i select is play then
                this.pause(); // current song paused
                this.currentTime = 0; //and set song current time to 0
            }
        });
        next_cur_song.play(); // current song play
        let pop_song_name = $(".current_song_list .song_name .audio_name").text(); // pop up song name select
        $(".pop_cur_song_name").text(pop_song_name); // copy to popup current song
        let cur_song_name = $(".pop_cur_song_name").text(); //  select current popup song
        $(".cur_song_name").text(cur_song_name); // copy to popup song name
        delWaveIcon();// delete music wave gif img
        creat_wave_icon();// add music wave gif img
        song_end();
        updateCurrentTime();
        music_duration(); // music duration show
        play_music_action(); // other music action cd animation play pause btn show hide
        progress(); // progess moving automatic with the song duration 
        progress_bar_point(); // on progress bar where click song playing there
    })

    $(".left_arrow").click((eve) => {

        eve.stopPropagation(); // stop when i click on arrow then current pop music is open 
        $(".current_song_list").addClass("stop_song");// add class stop_song in current_song_list 
        removeSongClass();// remove all current_song_list class 
        let prev = $(".stop_song").prev();// select stop_song previous song
        $(prev).addClass("current_song_list"); // then add current_song_list class in privious sibling element 

        if ($(".song:first").hasClass("stop_song")) { // check if first song have class stop_song name then 
            $(".song:first").removeClass("stop_song");// remove stop_song from first song
            $(".song:last").addClass("current_song_list");// add current_song_list class on last song
        }

        let next = $(".current_song_list").next();// select next sibling of current_song_list class
        next.removeClass("stop_song");// remove stop_song class on current_song_list next song
        let prev_cur_song = $(".current_song_list .song_name .audio")[0];// select current song

        $(".audio").each(function () {
            if (!this.paused) { // check which song who am i select is play then
                this.pause(); // current song paused
                this.currentTime = 0;//and set song current time to 0
            }
        });
        prev_cur_song.play();// current song play
        let pop_song_name = $(".current_song_list .song_name .audio_name").text();// pop up song name select
        $(".pop_cur_song_name").text(pop_song_name);// copy to popup current song
        let cur_song_name = $(".pop_cur_song_name").text(); //  select current popup song
        $(".cur_song_name").text(cur_song_name); // copy to popup song name
        delWaveIcon();// delete music wave gif img
        creat_wave_icon();// add music wave gif img
        song_end();
        updateCurrentTime();
        music_duration(); //music curation show
        play_music_action();// other music action cd animation play pause btn show hide
        progress();// progess moving automatic with the song duration 
        progress_bar_point()// on progress bar where click song playing there
    });
});


