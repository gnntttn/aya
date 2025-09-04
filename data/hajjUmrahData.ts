
import type { Language, HajjGuideStep } from '../types';

interface GuideData {
    hajj: HajjGuideStep[];
    umrah: HajjGuideStep[];
}

export const hajjUmrahData: { [key in Language]: GuideData } = {
    en: {
        hajj: [
            { title: "Step 1: Ihram", description: "Make your intention (niyyah) for Hajj and enter the state of Ihram before crossing the designated Miqat. For men, this involves wearing two unstitched white cloths. Women can wear regular, modest clothing." },
            { title: "Step 2: Tawaf al-Qudum", description: "Upon arriving in Makkah, perform the 'Tawaf of Arrival' by circumambulating the Kaaba seven times." },
            { title: "Step 3: Sa'i", description: "Perform Sa'i, walking and jogging seven times between the hills of Safa and Marwah." },
            { title: "Step 4: Day of Tarwiyah (8th Dhul Hijjah)", description: "Proceed to Mina and spend the day and night there, performing your daily prayers." },
            { title: "Step 5: Day of Arafat (9th Dhul Hijjah)", description: "Move to the plains of Arafat. This is the most important day of Hajj. Spend the day in prayer, supplication (dua), and seeking forgiveness." },
            { title: "Step 6: Muzdalifah", description: "After sunset, travel to Muzdalifah. Perform Maghrib and Isha prayers combined. Collect pebbles for the next day's ritual." },
            { title: "Step 7: Rami & Sacrifice (10th Dhul Hijjah)", description: "Return to Mina before sunrise. Perform 'Rami' by throwing seven pebbles at the largest pillar (Jamarat al-Aqabah). Then, offer the animal sacrifice (Qurbani)." },
            { title: "Step 8: Halq or Taqsir", description: "Shave your head (Halq) or trim your hair (Taqsir). You can now partially exit the state of Ihram." },
            { title: "Step 9: Tawaf al-Ifadah & Sa'i", description: "Return to Makkah to perform Tawaf al-Ifadah and another Sa'i. After this, you are fully released from Ihram." },
            { title: "Step 10: Days in Mina (11th, 12th, 13th Dhul Hijjah)", description: "Spend these days in Mina, performing Rami by stoning all three Jamarat pillars each day." },
            { title: "Step 11: Farewell Tawaf (Tawaf al-Wada)", description: "Before leaving Makkah, perform the Farewell Tawaf, the final circumambulation of the Kaaba." }
        ],
        umrah: [
            { title: "Step 1: Ihram", description: "Make your intention (niyyah) for Umrah and enter the state of Ihram at the designated Miqat." },
            { title: "Step 2: Tawaf", description: "Upon arriving in Makkah, perform Tawaf by circumambulating the Kaaba seven times." },
            { title: "Step 3: Sa'i", description: "Perform Sa'i, walking and jogging seven times between the hills of Safa and Marwah." },
            { title: "Step 4: Halq or Taqsir", description: "Complete your Umrah by shaving your head (Halq) or trimming your hair (Taqsir). You are now released from the state of Ihram." }
        ]
    },
    ar: {
        hajj: [
            { title: "الخطوة 1: الإحرام", description: "عقد نية الحج والدخول في الإحرام قبل تجاوز الميقات المحدد. للرجال، يشمل ذلك ارتداء قطعتي قماش بيضاء غير مخيطة. يمكن للنساء ارتداء ملابسهن العادية المحتشمة." },
            { title: "الخطوة 2: طواف القدوم", description: "عند الوصول إلى مكة، قم بأداء 'طواف القدوم' بالطواف حول الكعبة سبع مرات." },
            { title: "الخطوة 3: السعي", description: "أداء السعي بالمشي والهرولة سبع مرات بين الصفا والمروة." },
            { title: "الخطوة 4: يوم التروية (8 ذو الحجة)", description: "التوجه إلى منى وقضاء اليوم والليلة هناك، مع أداء الصلوات اليومية." },
            { title: "الخطوة 5: يوم عرفة (9 ذو الحجة)", description: "الانتقال إلى صعيد عرفات. هذا هو أهم يوم في الحج. اقضِ اليوم في الصلاة والدعاء وطلب المغفرة." },
            { title: "الخطوة 6: المزدلفة", description: "بعد غروب الشمس، انتقل إلى المزدلفة. صلِّ المغرب والعشاء جمعًا وقصرًا. اجمع الحصى لرمي الجمرات في اليوم التالي." },
            { title: "الخطوة 7: الرمي والنحر (10 ذو الحجة)", description: "العودة إلى منى قبل شروق الشمس. قم بـ 'رمي' جمرة العقبة الكبرى بسبع حصيات. ثم، قدم الأضحية (القربان)." },
            { title: "الخطوة 8: الحلق أو التقصير", description: "احلق رأسك (الحلق) أو قصّر شعرك (التقصير). يمكنك الآن التحلل الأصغر من الإحرام." },
            { title: "الخطوة 9: طواف الإفاضة والسعي", description: "العودة إلى مكة لأداء طواف الإفاضة وسعي آخر. بعد ذلك، تتحلل بالكامل من الإحرام." },
            { title: "الخطوة 10: أيام التشريق في منى (11، 12، 13 ذو الحجة)", description: "اقضِ هذه الأيام في منى، وقم برمي الجمرات الثلاث كل يوم." },
            { title: "الخطوة 11: طواف الوداع", description: "قبل مغادرة مكة، قم بأداء طواف الوداع، وهو الطواف الأخير حول الكعبة." }
        ],
        umrah: [
            { title: "الخطوة 1: الإحرام", description: "عقد نية العمرة والدخول في الإحرام من الميقات المحدد." },
            { title: "الخطوة 2: الطواف", description: "عند الوصول إلى مكة، قم بأداء الطواف بالطواف حول الكعبة سبع مرات." },
            { title: "الخطوة 3: السعي", description: "أداء السعي بالمشي والهرولة سبع مرات بين الصفا والمروة." },
            { title: "الخطوة 4: الحلق أو التقصير", description: "أكمل عمرتك بحلق رأسك (الحلق) أو تقصير شعرك (التقصير). أنت الآن تحللت من حالة الإحرام." }
        ]
    },
    fr: {
        hajj: [
            { title: "Étape 1 : Ihram", description: "Formulez votre intention (niyyah) pour le Hajj et entrez dans l'état d'Ihram avant de traverser le Miqat désigné. Pour les hommes, cela implique de porter deux pièces de tissu blanc non cousues. Les femmes peuvent porter des vêtements modestes." },
            { title: "Étape 2 : Tawaf al-Qudum", description: "En arrivant à La Mecque, effectuez le 'Tawaf d'arrivée' en tournant sept fois autour de la Kaaba." },
            { title: "Étape 3 : Sa'i", description: "Effectuez le Sa'i, en marchant et trottinant sept fois entre les collines de Safa et Marwah." },
            { title: "Étape 4 : Jour de Tarwiyah (8 Dhul Hijjah)", description: "Rendez-vous à Mina et passez-y le jour et la nuit, en effectuant vos prières quotidiennes." },
            { title: "Étape 5 : Jour d'Arafat (9 Dhul Hijjah)", description: "Déplacez-vous vers les plaines d'Arafat. C'est le jour le plus important du Hajj. Passez la journée en prière, supplication (dou'a) et à demander le pardon." },
            { title: "Étape 6 : Muzdalifah", description: "Après le coucher du soleil, rendez-vous à Muzdalifah. Effectuez les prières de Maghrib et Isha combinées. Ramassez des cailloux pour le rituel du lendemain." },
            { title: "Étape 7 : Rami et Sacrifice (10 Dhul Hijjah)", description: "Retournez à Mina avant le lever du soleil. Effectuez le 'Rami' en lançant sept cailloux sur la plus grande stèle (Jamarat al-Aqabah). Ensuite, offrez le sacrifice animal (Qurbani)." },
            { title: "Étape 8 : Halq ou Taqsir", description: "Rasez-vous la tête (Halq) ou coupez-vous les cheveux (Taqsir). Vous pouvez maintenant sortir partiellement de l'état d'Ihram." },
            { title: "Étape 9 : Tawaf al-Ifadah & Sa'i", description: "Retournez à La Mecque pour effectuer le Tawaf al-Ifadah et un autre Sa'i. Après cela, vous êtes entièrement libéré de l'Ihram." },
            { title: "Étape 10 : Jours à Mina (11, 12, 13 Dhul Hijjah)", description: "Passez ces jours à Mina, en effectuant le Rami en lapidant les trois stèles Jamarat chaque jour." },
            { title: "Étape 11 : Tawaf d'adieu (Tawaf al-Wada)", description: "Avant de quitter La Mecque, effectuez le Tawaf d'adieu, la dernière circumambulation de la Kaaba." }
        ],
        umrah: [
            { title: "Étape 1 : Ihram", description: "Formulez votre intention (niyyah) pour la Omra et entrez dans l'état d'Ihram au Miqat désigné." },
            { title: "Étape 2 : Tawaf", description: "En arrivant à La Mecque, effectuez le Tawaf en tournant sept fois autour de la Kaaba." },
            { title: "Étape 3 : Sa'i", description: "Effectuez le Sa'i, en marchant et trottinant sept fois entre les collines de Safa et Marwah." },
            { title: "Étape 4 : Halq ou Taqsir", description: "Terminez votre Omra en vous rasant la tête (Halq) ou en vous coupant les cheveux (Taqsir). Vous êtes maintenant libéré de l'état d'Ihram." }
        ]
    }
};
