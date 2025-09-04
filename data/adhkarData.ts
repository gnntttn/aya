
import type { Language, Dhikr } from '../types';

interface AdhkarData {
    morning: { [key in Language]: Dhikr[] };
    evening: { [key in Language]: Dhikr[] };
}

export const adhkarData: AdhkarData = {
    morning: {
        en: [
            {
                arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
                transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
                translation: "Ayat al-Kursi (Al-Baqarah 2:255). Whoever says this when he wakes up in the morning will be protected from jinn until he retires in the evening.",
                count: 1,
                virtue: "Protected from Jinn until evening."
            },
            {
                arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
                transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
                translation: "In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
                count: 3,
                virtue: "Nothing will harm him."
            },
            {
                arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...",
                transliteration: "Asbahna wa asbahal-mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
                translation: "We have reached the morning and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah...",
                count: 1,
                virtue: "Seeking goodness of the day and protection from its evil."
            },
        ],
        ar: [
            {
                arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
                transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
                translation: "آية الكرسي (البقرة ٢٥٥). من قالها حين يصبح أجير من الجن حتى يمسي.",
                count: 1,
                virtue: "حماية من الجن حتى المساء."
            },
            {
                arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
                transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
                translation: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.",
                count: 3,
                virtue: "لم يضره شيء."
            },
            {
                arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...",
                transliteration: "Asbahna wa asbahal-mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
                translation: "أصبحنا وأصبح الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير...",
                count: 1,
                virtue: "سؤال خير اليوم والحماية من شره."
            },
        ],
        fr: [
            {
                arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
                transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
                translation: "Ayat al-Kursi (Al-Baqarah 2:255). Quiconque le dit le matin sera protégé des djinns jusqu'au soir.",
                count: 1,
                virtue: "Protégé des Djinns jusqu'au soir."
            },
            {
                arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
                transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
                translation: "Au nom d'Allah, Celui dont le Nom protège de tout mal sur la terre et dans le ciel, et Il est l'Audient, l'Omniscient.",
                count: 3,
                virtue: "Rien ne lui nuira."
            },
            {
                arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...",
                transliteration: "Asbahna wa asbahal-mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
                translation: "Nous voici au matin et la royauté appartient à Allah, et la louange est à Allah. Il n'y a de divinité digne d'être adorée qu'Allah...",
                count: 1,
                virtue: "Chercher le bien du jour et la protection contre son mal."
            },
        ]
    },
    evening: {
        en: [
            {
                arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
                transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
                translation: "Ayat al-Kursi (Al-Baqarah 2:255). Whoever says this in the evening will be protected from jinn until the morning.",
                count: 1,
                virtue: "Protected from Jinn until morning."
            },
            {
                arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...",
                transliteration: "Amsayna wa amsal-mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
                translation: "We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah...",
                count: 1,
                virtue: "Seeking goodness of the night and protection from its evil."
            },
            {
                arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
                transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq.",
                translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
                count: 3,
                virtue: "Protection from harm."
            }
        ],
        ar: [
             {
                arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
                transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
                translation: "آية الكرسي (البقرة ٢٥٥). من قالها حين يمسي أجير من الجن حتى يصبح.",
                count: 1,
                virtue: "حماية من الجن حتى الصباح."
            },
            {
                arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...",
                transliteration: "Amsayna wa amsal-mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
                translation: "أمسينا وأمسى الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير...",
                count: 1,
                virtue: "سؤال خير الليلة والحماية من شرها."
            },
            {
                arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
                transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq.",
                translation: "أعوذ بكلمات الله التامات من شر ما خلق.",
                count: 3,
                virtue: "الحماية من كل مكروه."
            }
        ],
        fr: [
            {
                arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
                transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...",
                translation: "Ayat al-Kursi (Al-Baqarah 2:255). Quiconque le dit le soir sera protégé des djinns jusqu'au matin.",
                count: 1,
                virtue: "Protégé des Djinns jusqu'au matin."
            },
            {
                arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...",
                transliteration: "Amsayna wa amsal-mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
                translation: "Nous voici au soir et la royauté appartient à Allah, et la louange est à Allah...",
                count: 1,
                virtue: "Chercher le bien de la nuit et la protection contre son mal."
            },
            {
                arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
                transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq.",
                translation: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
                count: 3,
                virtue: "Protection contre le mal."
            }
        ]
    }
};
