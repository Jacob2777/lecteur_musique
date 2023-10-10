import { ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

export const page_active = ref("accueil")

export const musiques = ref([])
export const musique_active = ref()

export const temps_chanson = ref("00:00")

export const audio_player = ref(new Audio())
export const progression = ref(0)
export const progression_ref = ref()

export const play_pause = ref(false);
export const texte_btn_play = ref("Pause")

export const texte_recherche = ref("")

export const slider = ref(null)

export const barre_progression = ref(null)
export const barre_remplie = ref(null)

// Importe les musiques du fichier .json
fetch("chansons/chansons.json").then(resp => resp.json()).then(fichier => {
    musiques.value = fichier
})

//  Change la page en fonction du bouton qui est appuyé (soit le bouton pour accéder au lecteur ou le bouton retour)
export function changerPage(nom_page) {
    page_active.value = nom_page
}

// Change la musique lors d'un clic dans la liste et la fait jouer
export function changerMusique(musique) {
    musique_active.value = musique

    if (audio_player.value.paused) {
        // Charger et jouer la nouvelle piste audio
        audio_player.value.src = `chansons/${musique.audio}`
        audio_player.value.load() // Réinitialise l'audio

        setTimeout(() => {
            audio_player.value.play()
            playPause()
        }, 100)
    } else {
        // Mettre en pause l'audio actuel avant de charger et de jouer la nouvelle piste audio
        audio_player.value.pause()

        audio_player.value.src = `chansons/${musique.audio}`
        audio_player.value.load() // Réinitialise l'audio

        setTimeout(() => {
            audio_player.value.play()
            playPause()
        }, 100)
    }
}

// Formate le temps pour que l'affichage passe de secondes à minutes
export function formatTemps(secondes) {
    const minutes = Math.floor(secondes / 60)
    const secondes_restantes = secondes % 60
    const format_minutes = String(minutes).padStart(2, '0')
    const format_secondes = String(secondes_restantes).padStart(2, '0')
    return `${format_minutes}:${format_secondes}`
}

// Permet de mettre en pause ou de faire jouer la musique
export function playPause() {
    if (play_pause.value === false) {
        audio_player.value.pause()
        play_pause.value = true
        texte_btn_play.value = "Play"
    } else {
        audio_player.value.play()
        play_pause.value = false
        texte_btn_play.value = "Pause"
    }
}  

// Permet de gérer le volume via le slider
export function volume() {
    const volume = slider.value.value
    audio_player.value.volume = volume
}

// Filtre les musiques de la liste et retourne une copie filtrée
export function filtrer(musiques) {
    // Copier les musiques
    // Filtrer la copie
    const musiques_filtres = musiques.filter(musique => {
        const titre = musique.titre.toLowerCase()
        const artiste = musique.artiste.toLowerCase()
        const recherche = texte_recherche.value.toLowerCase()
        return artiste.includes(recherche) || titre.includes(recherche)
    })
    // Return la copie
    return musiques_filtres
}

// Met à jour le temps de la chanson afin d'afficher les secondes qui s'écoulent et mettre à jour la barre de progression
export function timeUpdate() {
    const progression = audio_player.value.currentTime
    const temps_formate = formatTemps(Math.floor(progression))
    progression_ref.value = temps_formate

    const duree = audio_player.value.duration
    const pourcentage_progression = (progression / duree) * 100
    barre_remplie.value.style.width = `${pourcentage_progression}%`
}
