"""
Health Report Generator - Creates detailed health reports
based on AI predictions. Contains a knowledge base of
crop diseases with symptoms, treatments, and prevention.
"""
from app.models.report import HealthReport

# ================================================================
# Disease Knowledge Base
# Each disease has: severity, description, symptoms, causes,
# treatment, prevention, and recommended products.
# ================================================================
DISEASE_DATABASE = {
    'Apple___Apple_scab': {
        'severity': 'moderate',
        'description': 'Apple scab is a common fungal disease caused by Venturia inaequalis. It affects apple leaves and fruit, causing dark, scabby lesions.',
        'symptoms': 'Olive-green to dark brown spots on leaves. Scabby, cracked spots on fruit surface. Premature leaf drop in severe cases. Distorted or stunted fruit growth.',
        'causes': 'Caused by the fungus Venturia inaequalis. Spreads through wind-borne spores during cool, wet spring weather (15-25°C). Overwinters in fallen infected leaves.',
        'treatment': '1. Apply fungicide (captan or myclobutanil) at early stages. 2. Remove and destroy infected leaves and fruit. 3. Prune trees to improve air circulation. 4. Apply lime sulfur during dormant season.',
        'prevention': 'Plant scab-resistant apple varieties (Liberty, Enterprise, Pristine). Rake and remove fallen leaves in autumn. Ensure good air circulation between trees. Avoid overhead watering.',
        'recommended_products': 'Captan 50WP fungicide, Myclobutanil spray, Neem oil (organic option), Lime sulfur (dormant spray)'
    },
    'Apple___Black_rot': {
        'severity': 'severe',
        'description': 'Black rot is a serious fungal disease of apples caused by Botryosphaeria obtusa. It can affect leaves, fruit, and bark.',
        'symptoms': 'Purple-bordered brown spots on leaves ("frogeye" pattern). Brown-to-black rot starting from the blossom end of fruit. Cankers on branches with rough, cracked bark.',
        'causes': 'Caused by the fungus Botryosphaeria obtusa. Enters through wounds, insect damage, or natural openings. Thrives in warm, humid conditions.',
        'treatment': '1. Remove all mummified fruit from trees and ground. 2. Prune out cankers and dead wood. 3. Apply fungicide during bloom period. 4. Maintain proper tree nutrition.',
        'prevention': 'Remove all dead wood and mummified fruit promptly. Keep trees healthy with proper fertilization. Control insects to minimize wound entry points. Apply preventive fungicide sprays.',
        'recommended_products': 'Captan fungicide, Thiophanate-methyl, Copper hydroxide spray, Pruning sealant'
    },
    'Apple___Cedar_apple_rust': {
        'severity': 'moderate',
        'description': 'Cedar apple rust is a fungal disease caused by Gymnosporangium juniperi-virginianae that requires both cedar/juniper and apple trees to complete its lifecycle.',
        'symptoms': 'Bright orange-yellow spots on upper leaf surface. Tiny black dots in center of spots. Cup-shaped structures (aecia) on underside of leaves. Spots may also appear on fruit.',
        'causes': 'Fungus alternates between cedar/juniper trees and apple trees. Spores travel via wind up to several miles. Infection occurs during warm, wet spring weather.',
        'treatment': '1. Apply fungicide (myclobutanil or mancozeb) in spring. 2. Remove nearby cedar or juniper trees if possible. 3. Remove galls from cedar trees in early spring before they produce spores.',
        'prevention': 'Plant rust-resistant apple varieties (Redfree, Liberty). Maintain distance from cedar/juniper trees. Apply preventive fungicide during spring rains. Monitor for early symptoms.',
        'recommended_products': 'Myclobutanil fungicide, Mancozeb spray, Immunox (home garden), Sulfur spray (organic)'
    },
    'Tomato___Bacterial_spot': {
        'severity': 'moderate',
        'description': 'Bacterial spot is caused by Xanthomonas species. It affects tomato leaves, stems, and fruit, causing significant yield loss.',
        'symptoms': 'Small, dark, water-soaked spots on leaves. Spots become angular and may have yellow halos. Raised, scab-like spots on fruit. Severe defoliation in humid conditions.',
        'causes': 'Caused by Xanthomonas bacteria. Spreads through contaminated seed, infected transplants, rain splash, and overhead irrigation. Thrives in warm, humid weather (24-30°C).',
        'treatment': '1. Apply copper-based bactericide at first sign of disease. 2. Remove severely infected plants. 3. Avoid working with plants when wet. 4. Apply fixed copper + mancozeb combination.',
        'prevention': 'Use certified disease-free seed and transplants. Practice crop rotation (3-year cycle). Avoid overhead irrigation. Space plants for good air circulation. Sanitize tools between plants.',
        'recommended_products': 'Copper hydroxide spray, Copper sulfate + mancozeb, Bactericide (Streptomycin for severe cases), Serenade Garden Disease Control (organic)'
    },
    'Tomato___Early_blight': {
        'severity': 'moderate',
        'description': 'Early blight is one of the most common tomato diseases, caused by the fungus Alternaria solani. It typically appears on older, lower leaves first.',
        'symptoms': 'Dark brown spots with concentric rings (target-like pattern) on lower leaves. Yellowing around spots. Progressive defoliation from bottom up. Dark lesions on stems. Leathery dark spots on fruit near stem.',
        'causes': 'Caused by Alternaria solani fungus. Survives in soil and plant debris. Spreads through wind, rain splash, and contaminated tools. Favored by warm temperatures and high humidity.',
        'treatment': '1. Remove infected lower leaves immediately. 2. Apply chlorothalonil or mancozeb fungicide. 3. Mulch around plants to prevent soil splash. 4. Ensure adequate plant nutrition (calcium, potassium).',
        'prevention': 'Rotate crops (avoid tomatoes in same spot for 3 years). Mulch heavily to prevent soil splash. Water at soil level, not overhead. Provide good spacing and air circulation. Use resistant varieties if available.',
        'recommended_products': 'Chlorothalonil (Daconil), Mancozeb, Copper fungicide, Organic: Serenade + Neem oil rotation'
    },
    'Tomato___Late_blight': {
        'severity': 'severe',
        'description': 'Late blight is a devastating disease caused by Phytophthora infestans - the same pathogen that caused the Irish Potato Famine. It can destroy entire crops within days.',
        'symptoms': 'Large, irregular, water-soaked patches on leaves that turn brown. White fuzzy mold on undersides of leaves in humid conditions. Dark streaks on stems. Firm, dark spots on fruit with greasy appearance.',
        'causes': 'Caused by the oomycete Phytophthora infestans. Spreads rapidly through airborne spores in cool (10-25°C), moist conditions. Can travel long distances by wind.',
        'treatment': '1. ACT IMMEDIATELY - this disease spreads very fast. 2. Apply chlorothalonil or mancozeb fungicide. 3. Remove and destroy all infected plants (do not compost). 4. Treat neighboring plants preventively.',
        'prevention': 'Monitor weather forecasts for cool, wet conditions. Apply preventive fungicide before forecasted rain. Avoid overhead watering. Improve air circulation. Plant resistant varieties (Defiant, Mountain Magic).',
        'recommended_products': 'Chlorothalonil (Daconil), Mancozeb + copper combination, Phosphorous acid fungicide, Organic: Copper spray + Bacillus subtilis'
    },
    'Tomato___Leaf_Mold': {
        'severity': 'mild',
        'description': 'Leaf mold is caused by the fungus Passalora fulva. It primarily affects greenhouse tomatoes but can also occur in outdoor humid conditions.',
        'symptoms': 'Pale green to yellow spots on upper leaf surface. Olive-green to brown velvety mold on lower leaf surface. Leaves may curl and wither. Rarely affects fruit.',
        'causes': 'Caused by Passalora fulva fungus. Thrives in high humidity (above 85%) and moderate temperatures. Common in greenhouses with poor ventilation.',
        'treatment': '1. Improve ventilation and reduce humidity. 2. Remove affected leaves. 3. Apply chlorothalonil or mancozeb fungicide. 4. Reduce watering frequency and water at base of plants.',
        'prevention': 'Ensure good air circulation (wider spacing, pruning lower leaves). Keep greenhouse humidity below 85%. Use drip irrigation instead of overhead watering. Choose resistant varieties.',
        'recommended_products': 'Chlorothalonil fungicide, Copper spray, Neem oil, Improve ventilation (fans in greenhouse)'
    },
    'Tomato___Septoria_leaf_spot': {
        'severity': 'moderate',
        'description': 'Septoria leaf spot is a common fungal disease caused by Septoria lycopersici. It can cause severe defoliation and reduce fruit quality.',
        'symptoms': 'Small (2-3mm), circular spots with dark brown borders and gray centers. Tiny dark dots (pycnidia) visible in spot centers with magnification. Lower leaves affected first. Progressive defoliation.',
        'causes': 'Caused by Septoria lycopersici fungus. Survives in plant debris. Spreads by rain splash, overhead watering, and handling wet plants. Favored by warm, wet weather.',
        'treatment': '1. Remove infected leaves promptly. 2. Apply chlorothalonil or copper fungicide. 3. Mulch to prevent soil splash. 4. Apply fungicide every 7-10 days during wet weather.',
        'prevention': 'Rotate crops yearly. Remove all plant debris at end of season. Mulch around plants. Avoid overhead watering. Stake or cage plants to keep foliage off ground.',
        'recommended_products': 'Chlorothalonil (Daconil), Copper fungicide, Mancozeb, Organic: Neem oil + Copper rotation'
    },
    'Tomato___Spider_mites_Two-spotted_spider_mite': {
        'severity': 'moderate',
        'description': 'Two-spotted spider mites (Tetranychus urticae) are tiny arachnids that feed on plant cells, causing stippling and bronzing of leaves.',
        'symptoms': 'Fine stippling (tiny white/yellow dots) on upper leaf surface. Bronzing or yellowing of leaves. Fine webbing on undersides of leaves and between branches. Leaf drop in severe infestations.',
        'causes': 'Spider mites thrive in hot, dry conditions. They reproduce rapidly (a new generation every 1-2 weeks). Overuse of broad-spectrum insecticides can kill natural predators, causing outbreaks.',
        'treatment': '1. Spray plants with strong water jet to dislodge mites. 2. Apply insecticidal soap or neem oil. 3. Release predatory mites (Phytoseiulus persimilis). 4. Apply miticide (abamectin) for severe infestations.',
        'prevention': 'Maintain adequate plant hydration. Avoid dusty conditions. Encourage beneficial insects. Monitor regularly with hand lens. Avoid broad-spectrum insecticides that kill predators.',
        'recommended_products': 'Insecticidal soap spray, Neem oil concentrate, Predatory mites (biological control), Abamectin miticide (severe cases)'
    },
    'Tomato___Target_Spot': {
        'severity': 'moderate',
        'description': 'Target spot is caused by the fungus Corynespora cassiicola. It affects leaves, stems, and fruit of tomato plants.',
        'symptoms': 'Small, brown spots with concentric rings (target pattern). Spots larger than Septoria but smaller than Early Blight. Can appear on any part of the plant. Significant defoliation possible.',
        'causes': 'Caused by Corynespora cassiicola fungus. Spreads via wind-borne spores and rain splash. Favored by warm, humid conditions and poor air circulation.',
        'treatment': '1. Remove infected leaves and plant debris. 2. Apply chlorothalonil or azoxystrobin fungicide. 3. Improve air circulation by pruning lower branches. 4. Apply fungicide preventively in humid weather.',
        'prevention': 'Space plants adequately for air circulation. Prune lower branches to prevent soil splash. Practice crop rotation. Remove plant debris at season end.',
        'recommended_products': 'Chlorothalonil, Azoxystrobin (Amistar), Copper spray, Mancozeb'
    },
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
        'severity': 'severe',
        'description': 'TYLCV is a devastating viral disease transmitted by whiteflies (Bemisia tabaci). Infected plants produce very few or no fruit.',
        'symptoms': 'Severe upward curling of leaves. Yellowing of leaf edges. Stunted, bushy growth. Flower drop. Very small or no fruit production. Plants appear "bunchy" at top.',
        'causes': 'Caused by Tomato Yellow Leaf Curl Virus. Transmitted exclusively by silverleaf whiteflies. Cannot be transmitted mechanically or through seed. Whiteflies acquire virus in 15-30 minutes of feeding.',
        'treatment': '1. THERE IS NO CURE for viral diseases. 2. Remove and destroy infected plants immediately. 3. Control whitefly population aggressively. 4. Apply imidacloprid or thiamethoxam for whitefly control.',
        'prevention': 'Use TYLCV-resistant varieties (available from major seed companies). Use reflective mulch to repel whiteflies. Install fine mesh screens in greenhouses. Apply neem oil to control whiteflies. Remove weeds that host whiteflies.',
        'recommended_products': 'Whitefly sticky traps (yellow), Neem oil spray, Imidacloprid (systemic insecticide), Reflective mulch, Fine mesh insect netting'
    },
    'Tomato___Tomato_mosaic_virus': {
        'severity': 'moderate',
        'description': 'Tomato Mosaic Virus (ToMV) is a highly stable virus that can survive on surfaces and in soil for years. It affects tomato growth and yield.',
        'symptoms': 'Light and dark green mottled pattern on leaves (mosaic). Leaf curling and distortion. Stunted growth. Uneven fruit ripening. Internal browning of fruit wall (brownwall).',
        'causes': 'Caused by Tomato Mosaic Virus. Extremely easily transmitted through touch, contaminated tools, seed, and even clothing. Can survive in soil and on surfaces for months to years.',
        'treatment': '1. NO CURE exists for viral diseases. 2. Remove and destroy infected plants. 3. Disinfect all tools with 10% bleach solution. 4. Wash hands thoroughly after handling infected plants.',
        'prevention': 'Use TMV-resistant varieties (most modern varieties are resistant). Disinfect tools between plants. Wash hands before handling plants. Do not smoke near plants (tobacco can carry related viruses). Buy certified virus-free seed.',
        'recommended_products': '10% bleach solution for tool disinfection, TMV-resistant seed varieties, Milk spray (10% milk solution as preventive), Hand sanitizer for garden use'
    },
    'Potato___Early_blight': {
        'severity': 'moderate',
        'description': 'Potato early blight is caused by Alternaria solani, the same fungus that affects tomatoes. It can reduce yield by 20-30% if untreated.',
        'symptoms': 'Dark brown spots with concentric rings on older leaves (target pattern). Yellowing around spots. Starts on lower leaves and moves upward. Can also cause dry rot on tubers.',
        'causes': 'Caused by Alternaria solani. Survives in soil, plant debris, and infected tubers. Spread by wind, rain, and irrigation water. Favored by warm days, cool nights, and high humidity.',
        'treatment': '1. Apply chlorothalonil or mancozeb fungicide at first symptoms. 2. Remove severely infected foliage. 3. Maintain adequate soil moisture (stress worsens disease). 4. Ensure proper plant nutrition.',
        'prevention': 'Use certified disease-free seed potatoes. Rotate crops (3+ years). Destroy volunteer potatoes. Hill soil around plants to protect tubers. Water early in day so foliage dries.',
        'recommended_products': 'Chlorothalonil (Daconil), Mancozeb, Copper fungicide, Organic: Bacillus subtilis products'
    },
    'Potato___Late_blight': {
        'severity': 'severe',
        'description': 'Potato late blight, caused by Phytophthora infestans, is one of the most destructive plant diseases in history. It caused the Irish Potato Famine (1845-1852).',
        'symptoms': 'Water-soaked, pale green spots that quickly turn dark brown/black. White mold growth on undersides of leaves. Rapid collapse of entire plant. Firm, brown rot in tubers.',
        'causes': 'Caused by the oomycete Phytophthora infestans. Spreads explosively in cool (10-20°C), moist conditions. Airborne spores can travel many miles. Infects through infected seed tubers.',
        'treatment': '1. ACT IMMEDIATELY - can destroy entire field in days. 2. Apply metalaxyl + mancozeb or chlorothalonil. 3. Destroy all infected plants (burn or deep bury). 4. Do not harvest tubers from infected plants for 2 weeks after vine death.',
        'prevention': 'Use certified disease-free seed potatoes. Plant resistant varieties. Apply preventive fungicide before cool, wet weather. Destroy volunteer potato plants. Ensure good drainage.',
        'recommended_products': 'Metalaxyl + Mancozeb (Ridomil Gold), Chlorothalonil, Copper hydroxide, Phosphorous acid products'
    },
    'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot': {
        'severity': 'moderate',
        'description': 'Gray leaf spot is a major corn disease caused by Cercospora zeae-maydis. It can cause significant yield loss, especially in humid regions.',
        'symptoms': 'Rectangular, gray to tan lesions between leaf veins. Lesions are sharply defined by veins. Lower leaves affected first. In severe cases, entire leaf may be killed.',
        'causes': 'Caused by Cercospora zeae-maydis fungus. Survives in infected corn residue. Spreads by wind-borne spores. Favored by extended periods of high humidity and moderate temperatures.',
        'treatment': '1. Apply foliar fungicide (azoxystrobin or pyraclostrobin) at first sign. 2. Apply before or at tasseling for best results. 3. Consider economic threshold before treating.',
        'prevention': 'Plant resistant hybrids. Rotate with non-host crops (soybeans). Tillage to bury infected residue. Avoid continuous corn planting. Manage irrigation to reduce leaf wetness.',
        'recommended_products': 'Azoxystrobin (Quadris), Pyraclostrobin (Headline), Triazole fungicides, Resistant corn hybrids'
    },
    'Corn_(maize)___Common_rust_': {
        'severity': 'mild',
        'description': 'Common rust is a fungal disease of corn caused by Puccinia sorghi. While widespread, it rarely causes severe yield loss in most regions.',
        'symptoms': 'Small, circular to elongated, reddish-brown pustules on both leaf surfaces. Pustules break through the leaf epidermis releasing powdery rust-colored spores. Turns dark brown to black late in season.',
        'causes': 'Caused by Puccinia sorghi fungus. Spores are wind-borne from southern regions each year. Cannot overwinter in cold climates. Favored by cool, humid conditions (16-23°C).',
        'treatment': '1. Usually no treatment needed for light infections. 2. For severe cases, apply foliar fungicide (azoxystrobin or propiconazole). 3. Treat before tasseling if lesions are abundant on upper leaves.',
        'prevention': 'Plant resistant hybrids (most commercial hybrids have adequate resistance). Early planting helps avoid peak spore loads. Scout fields regularly during cool, wet periods.',
        'recommended_products': 'Propiconazole (Tilt), Azoxystrobin (Quadris), Resistant corn hybrids, Usually no treatment needed'
    },
    'Corn_(maize)___Northern_Leaf_Blight': {
        'severity': 'moderate',
        'description': 'Northern corn leaf blight (NCLB) is caused by Exserohilum turcicum. It can reduce yields by 30-50% when severe and develops before or during flowering.',
        'symptoms': 'Large (2-15 cm), cigar-shaped, gray-green to tan lesions. Starts on lower leaves and moves up. In severe cases, entire leaves may die. Dark, dusty spore production in humid conditions.',
        'causes': 'Caused by Exserohilum turcicum (also called Setosphaeria turcica). Survives in corn debris. Spores spread by wind and rain. Favored by moderate temperatures (18-27°C) and high humidity.',
        'treatment': '1. Apply fungicide at early tassel if lower leaves show significant lesions. 2. Use azoxystrobin + propiconazole combination. 3. Economic threshold: if lesions reach third leaf below ear before tasseling.',
        'prevention': 'Plant resistant hybrids (Ht genes provide good resistance). Rotate with soybeans or other non-host crops. Tillage to reduce inoculum. Avoid planting corn after corn.',
        'recommended_products': 'Azoxystrobin + Propiconazole (Quilt), Pyraclostrobin (Headline), Triazole fungicides, Ht-resistant hybrids'
    },
    'Grape___Black_rot': {
        'severity': 'severe',
        'description': 'Grape black rot is caused by the fungus Guignardia bidwellii. It is one of the most destructive grape diseases in humid regions.',
        'symptoms': 'Brown circular lesions with dark borders on leaves. Affected berries turn brown, shrivel, and become hard "mummies". Dark, raised pycnidia visible on mummies. Shoot and tendril infections.',
        'causes': 'Caused by Guignardia bidwellii. Overwinters in mummified fruit. Spores released during rain in spring. Infection requires 6+ hours of leaf wetness.',
        'treatment': '1. Apply fungicide (myclobutanil or mancozeb) from early shoot growth through veraison. 2. Remove and destroy all mummified fruit. 3. Spray at 10-14 day intervals during rainy periods.',
        'prevention': 'Remove mummies from vines and ground. Prune for open canopy and air circulation. Plant in sunny locations. Choose resistant varieties when possible.',
        'recommended_products': 'Myclobutanil (Rally), Mancozeb, Captan, Copper spray (organic option)'
    },
    'Pepper,_bell___Bacterial_spot': {
        'severity': 'moderate',
        'description': 'Bacterial spot of pepper is caused by Xanthomonas euvesicatoria. It affects leaves, stems, and fruit, reducing yield and fruit quality.',
        'symptoms': 'Small, water-soaked spots on leaves that turn brown. Spots may have yellow halos. Raised, scab-like lesions on fruit. Severe defoliation exposes fruit to sunscald.',
        'causes': 'Caused by Xanthomonas bacteria. Spread by rain splash, contaminated seed, and handling wet plants. Thrives in warm, humid conditions.',
        'treatment': '1. Apply copper-based bactericide. 2. Remove severely infected plants. 3. Avoid handling plants when wet. 4. Copper + mancozeb provides better control than copper alone.',
        'prevention': 'Use pathogen-free seed and transplants. Rotate crops (2-3 years). Avoid overhead irrigation. Space plants for air circulation.',
        'recommended_products': 'Copper hydroxide, Copper sulfate + mancozeb, Serenade (biological), Disease-free seed'
    },
    'Squash___Powdery_mildew': {
        'severity': 'moderate',
        'description': 'Powdery mildew of squash is caused by Podosphaera xanthii and Erysiphe cichoracearum. It is one of the most common cucurbit diseases worldwide.',
        'symptoms': 'White, powdery coating on upper and lower leaf surfaces. Starts as small white spots that expand. Leaves turn yellow and brown. Premature leaf death reduces fruit quality and yield.',
        'causes': 'Caused by fungal spores spread by wind. Does NOT require wet leaves (unlike most fungal diseases). Favored by warm days, cool nights, and moderate humidity. Shade promotes disease.',
        'treatment': '1. Apply potassium bicarbonate or sulfur spray at first sign. 2. Alternate with neem oil applications. 3. For severe cases, use myclobutanil. 4. Remove severely infected leaves.',
        'prevention': 'Plant resistant varieties. Ensure full sun exposure. Space plants for air circulation. Apply preventive sulfur or neem oil. Avoid excess nitrogen fertilizer.',
        'recommended_products': 'Potassium bicarbonate (MilStop), Sulfur spray, Neem oil, Myclobutanil (for severe cases)'
    },
    'Strawberry___Leaf_scorch': {
        'severity': 'moderate',
        'description': 'Strawberry leaf scorch is caused by the fungus Diplocarpon earlianum. It can weaken plants over multiple seasons, reducing fruit production.',
        'symptoms': 'Irregular, dark purple spots on upper leaf surface. Spots may merge, giving scorched appearance. Leaf margins may dry and curl upward. Infected calyxes and flower stalks.',
        'causes': 'Caused by Diplocarpon earlianum fungus. Spreads by rain splash. Survives in infected plant debris. Favored by warm, wet conditions during spring and early summer.',
        'treatment': '1. Apply fungicide (captan or myclobutanil) at first sign. 2. Remove and destroy severely infected leaves. 3. Apply after harvest and during renovation.',
        'prevention': 'Plant resistant varieties. Ensure good air circulation. Remove old leaves after harvest. Practice row renovation. Avoid overhead irrigation.',
        'recommended_products': 'Captan fungicide, Myclobutanil, Copper spray, Organic: Neem oil'
    },
    'Peach___Bacterial_spot': {
        'severity': 'moderate',
        'description': 'Bacterial spot of peach is caused by Xanthomonas arboricola pv. pruni. It affects leaves, fruit, and twigs of peach and nectarine trees.',
        'symptoms': 'Small, angular, water-soaked spots on leaves. Spots turn brown and may fall out (shot-hole). Shallow, brown pits on fruit. Tip dieback on twigs.',
        'causes': 'Caused by Xanthomonas bacteria. Spread by rain splash and wind-driven rain. Enters through stomata and wounds. Favored by warm, wet, windy weather.',
        'treatment': '1. Apply oxytetracycline (Mycoshield) during bloom. 2. Apply copper sprays in fall after harvest. 3. Prune out infected twigs. 4. Maintain tree vigor with proper nutrition.',
        'prevention': 'Plant resistant varieties (most newer varieties have improved resistance). Avoid low-lying, poorly drained sites. Windbreaks reduce rain-splash spread. Maintain proper tree spacing.',
        'recommended_products': 'Oxytetracycline (Mycoshield), Copper hydroxide (fall application), Resistant varieties, Proper nutrition program'
    },
    'Orange___Haunglongbing_(Citrus_greening)': {
        'severity': 'severe',
        'description': 'Huanglongbing (HLB), also called Citrus Greening, is the most devastating citrus disease worldwide. Caused by Candidatus Liberibacter bacteria transmitted by Asian citrus psyllid.',
        'symptoms': 'Asymmetric yellowing (blotchy mottle) on leaves. Lopsided, small, green fruit that stays green. Bitter, misshapen fruit. Twig dieback. Tree decline over 3-5 years.',
        'causes': 'Caused by Candidatus Liberibacter asiaticus bacteria. Transmitted by Asian citrus psyllid (Diaphorina citri). Also spread through grafting with infected budwood.',
        'treatment': '1. NO CURE exists. 2. Manage psyllid population aggressively with insecticides. 3. Enhanced nutrition program to keep trees productive longer. 4. Remove severely affected trees to reduce inoculum.',
        'prevention': 'Control Asian citrus psyllid with regular insecticide applications. Use only certified disease-free nursery stock. Report suspected HLB to agricultural authorities. Remove infected trees promptly.',
        'recommended_products': 'Imidacloprid (systemic for psyllid), Horticultural oil sprays, Nutrient sprays (zinc, manganese, iron), Kaolin clay (psyllid deterrent)'
    },
}

# Default info for healthy plants and unknown diseases
HEALTHY_TEMPLATE = {
    'severity': 'none',
    'symptoms': 'No disease symptoms detected. The plant appears healthy.',
    'causes': 'N/A - Plant is healthy.',
    'treatment': 'Continue regular care and monitoring. Maintain proper watering schedule, ensure adequate sunlight, and provide balanced nutrition.',
    'prevention': 'Maintain proper watering (avoid overwatering). Ensure adequate spacing for air circulation. Rotate crops annually. Monitor regularly for early signs of disease. Keep garden clean of debris.',
    'recommended_products': 'General purpose balanced fertilizer (10-10-10), Neem oil (preventive spray), Compost for soil health, Mulch for moisture retention'
}

UNKNOWN_DISEASE_TEMPLATE = {
    'severity': 'unknown',
    'description': 'A disease has been detected but detailed information is not available in our database.',
    'symptoms': 'Visible damage or abnormalities detected on plant tissue.',
    'causes': 'Multiple factors may contribute including fungal, bacterial, or viral pathogens, as well as environmental stress.',
    'treatment': '1. Isolate the affected plant from healthy plants. 2. Remove and destroy severely affected leaves. 3. Consult a local agricultural extension service for specific diagnosis. 4. Take clear photos for expert analysis.',
    'prevention': 'Practice crop rotation. Maintain plant hygiene. Monitor plants regularly. Ensure proper nutrition and watering.',
    'recommended_products': 'Broad-spectrum fungicide (copper-based), Neem oil, Consult local agricultural expert for specific recommendations'
}


def generate_health_report(prediction):
    """
    Generate a health report based on the AI prediction.
    
    Uses the disease knowledge base to provide detailed
    information about the detected disease, including
    symptoms, causes, treatment, and prevention.
    
    Args:
        prediction: Prediction model instance
    
    Returns:
        HealthReport model instance (not yet committed to DB)
    """
    if prediction.is_healthy:
        # Healthy plant report
        info = HEALTHY_TEMPLATE
        return HealthReport(
            prediction_id=prediction.id,
            severity='none',
            description=f'Great news! Your {prediction.crop_name} plant appears to be healthy. No signs of disease were detected in the uploaded image. The AI model is {prediction.confidence * 100:.1f}% confident in this assessment.',
            symptoms=info['symptoms'],
            causes=info['causes'],
            treatment=info['treatment'],
            prevention=info['prevention'],
            recommended_products=info['recommended_products']
        )
    
    # Look up disease in knowledge base
    disease_info = DISEASE_DATABASE.get(prediction.predicted_class)
    
    if disease_info:
        return HealthReport(
            prediction_id=prediction.id,
            severity=disease_info['severity'],
            description=disease_info['description'] + f' The AI model detected this with {prediction.confidence * 100:.1f}% confidence.',
            symptoms=disease_info['symptoms'],
            causes=disease_info['causes'],
            treatment=disease_info['treatment'],
            prevention=disease_info['prevention'],
            recommended_products=disease_info['recommended_products']
        )
    else:
        # Unknown disease - use template
        info = UNKNOWN_DISEASE_TEMPLATE
        return HealthReport(
            prediction_id=prediction.id,
            severity=info['severity'],
            description=f'{info["description"]} Detected: {prediction.disease_name} on {prediction.crop_name} with {prediction.confidence * 100:.1f}% confidence.',
            symptoms=info['symptoms'],
            causes=info['causes'],
            treatment=info['treatment'],
            prevention=info['prevention'],
            recommended_products=info['recommended_products']
        )
