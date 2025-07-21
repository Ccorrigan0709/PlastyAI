#!/usr/bin/env python3le script to match foods from plasticizer data with foods in labels.txt""

def load_labels():
    "d food labels from labels.txt" with open(labels.txt', r f:
        return [line.strip() for line in f.readlines()]

def load_plasticizer_data():
 d plasticizer data from the text file"  plasticizer_data = {}
    
    with open('Foods with plactisizers.txt', rs f:
        lines = f.readlines()
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line and not line.replace('.', ').replace('-, git():
            # This is a food name
            food_name = line
            i += 1            if i < len(lines):
                # Next line should be the plasticizer value
                try:
                    plasticizer_value = float(lines[i].strip())
                    plasticizer_data[food_name] = plasticizer_value
                except ValueError:
                    pass  # Skip if not a valid number
        i += 1
    return plasticizer_data

def find_matches(labels, plasticizer_data):
 nd matches between labels and plasticizer data"""
    matches = {}
    
    # Simple keyword matching
    keyword_mapping = {
       macaroni_and_cheese':mac', 'macaroni', cheese, kraft',annie'],
      chicken_curry': ['chicken',curry'],
     chicken_quesadilla':chicken, sadilla'],
      chicken_wings': ['chicken',wings'],
       grilled_cheese_sandwich': [grilled, cheese', 'sandwich],
       steak:beef', 'steak', ribeye],
        filet_mignon:beef', 'filet', mignon'],
       beef_carpaccio': [beef', 'carpaccio'],
        beef_tartare': ['beef', 'tartare],
       prime_rib:beef',prime, rib'],
      pork_chop': ['pork', chop'],
       fish_and_chips: [fishchips'],
       grilled_salmon': ['salmon', fish'],
       sashimi': ['sashimi', fish],
        sushi: [sushi, fish'],
        tuna_tartare': ['tuna', fish],
       fried_calamari:calamari',squid'],
        clam_chowder': ['clam', 'chowder'],
       crab_cakes':crab'],
       lobster_bisque': ['lobster'],
        lobster_roll_sandwich': ['lobster'],
    oysters': [oyster],
      scallops': ['scallop'],
    mussels': [mussel'],
       shrimp_and_grits': [shrimp'],
      seaweed_salad': ['seaweed'],
        garlic_bread': ['bread', garlic'],
        french_toast': ['toast', french'],
        pancakes': ['pancake'],
       waffles': [waffle'],
       donuts': ['donut'],
       churros': [churro'],
      croque_madame': [croque'],
      lasagna': ['lasagna',pasta'],
      ravioli': ['ravioli',pasta'],
       gnocchi': ['gnocchi',pasta'],
       spaghetti_bolognese: ['spaghetti',pasta'],
       spaghetti_carbonara: ['spaghetti',pasta'],
      risotto': ['risotto', rice],
      fried_rice: [ricefried'],
        caesar_salad: ['caesar',salad],
        greek_salad': ['greek',salad'],
      caprese_salad': ['caprese',salad'],
        beet_salad: [beetsalad'],
        french_onion_soup: [onion, soup'],
        hot_and_sour_soup':soup'],
      miso_soup': ['miso', soup],
       pho': ['pho', soup],
        ramen: [ramen, soup'],
       bibimbap': ['bibimbap'],
       pad_thai': ['pad', thai'],
        paella': [paella],
       takoyaki': ['takoyaki],
      gyoza': ['gyoza'],
        dumplings': ['dumpling'],
        spring_rolls': ['spring', roll'],
        samosa': [samosa],
     tacos':taco'],
       nachos': ['nacho'],
       huevos_rancheros:['huevos', 'rancheros'],
       guacamole: [acamole'],
        hummus': [hummus'],
     hamburger': ['burger', 'hamburger],
        hot_dog': ['hot, dog],
      pizza': ['pizza'],
      club_sandwich': ['club', 'sandwich'],
       pulled_pork_sandwich': ['pulled',pork', 'sandwich],
      cheesecake': ['cheesecake'],
       chocolate_cake: [chocolate', cake'],
        red_velvet_cake:red, velvet', cake'],
       carrot_cake': ['carrot', cake],        cup_cakes': ['cupcake'],
       chocolate_mousse: ['chocolate', mousse],
        creme_brulee': ['creme', brulee],
        panna_cotta': ['panna',cotta],
      tiramisu': ['tiramisu'],
       cannoli': ['cannoli],
       macarons': ['macaron],        breakfast_burrito:['breakfast', 'burrito'],
      eggs_benedict:['eggs', 'benedict'],
       omelette': ['omelette', omelet],
       onion_rings: [onion, ring'],
        french_fries': ['fries', french'],
      frozen_yogurt': ['yogurt', frozen'],
        ice_cream': icecream'],
        coffee': [coffee],
      tea: tea'],
        milkmilk],
      water': ['water],
      juice': ['juice'],
     smoothie': ['smoothie],
      shake': ['shake'],
        cheese_plate': [cheese'],
        yogurt': [yogurt],
      apple': ['apple'],
        banana': [banana],       strawberry': ['strawberry'],
        tomato': [tomato'],
        carrot': [carrot'],
       broccoli': ['broccoli'],
       cucumber': ['cucumber],
      peach': ['peach'],
        pearpear],
        orange': [orange],
      lemon': ['lemon],
     limes':lime],
      grape': ['grape'],
        cherry': [cherry'],
     blueberry: [ueberry'],
        raspberry: [spberry],     blackberry': ['blackberry'],
     avocado': ['avocado],
      mango': ['mango'],
     pineapple: [neapple],     watermelon': ['watermelon'],
       cantaloupe': ['cantaloupe],
     honeydew': ['honeydew'],
        kiwikiwi'],
        papaya': [papaya],
      guava': ['guava],
      fig: ['fig],
     dates':date],
      prune': ['prune'],
        raisin': [raisin'],
      cranberry: [anberry'],
        pomegranate': ['pomegranate],     grapefruit': ['grapefruit'],
      tangerine: [ngerine'],
      clementine': ['clementine'],
     mandarine': ['mandarin'],
        plumplum],
        apricot': ['apricot'],
      nectarine: [ctarine'],
        quince': [quince'],
     persimmon: [rsimmon'],
       mulberry': ['mulberry],       gooseberry': ['gooseberry'],
      currant': ['currant],       elderberry': ['elderberry'],
       boysenberry': ['boysenberry],     loganberry': ['loganberry'],
       marionberry': ['marionberry],
        olallieberry': ['olallieberry'],
      saskatoon: [skatoon'],
       chokecherry': ['chokecherry'],
        serviceberry': ['serviceberry'],
      juneberry: [neberry'],
        huckleberry': ['huckleberry'],
       lingonberry': ['lingonberry],     cloudberry': ['cloudberry'],
       salmonberry': ['salmonberry'],
      wineberry: [neberry'],
       dewberry': ['dewberry'],
    bramble': ['bramble'],
        thimbleberry': ['thimbleberry'],
       tayberry': ['tayberry],     youngberry': ['youngberry'],
        santol': [santol],
        soursop': ['soursop'],
      custard_apple': ['custard',apple],
        sugar_apple': ['sugar',apple'],
     cherimoya: [erimoya'],
     guanabana: [anabana'],
       atemoya': ['atemoya],
      ilama': ['ilama'],
       soncoya': ['soncoya'],
        biriba': [biriba'],
      wild_sweetsop': ['wild', 'sweetsop'],
       mountain_soursop: [mountain', 'soursop'],
        poshte': [poshte'],
     sweetsop': ['sweetsop'],
      bullock_heart': ['bullock',heart'],
        ox_heart':oxheart],
      heart_of_bull: [heart, bull'],
      corazon': ['corazon'],
        anonanon],
      anona': ['anona],
        anona_blanca': ['anona', blanca],     anona_colorada': [anona', 'colorada],
        anona_roja: [anona, roja],
       anona_verde': ['anona',verde],
       anona_amarilla: [anona', 'amarilla],
        anona_morada': ['anona', morada],
       anona_negra': ['anona', 'negra],    }
    
    for food_name, plasticizer_value in plasticizer_data.items():
        food_lower = food_name.lower()
        
        # Try to match with our mapping
        for label, keywords in keyword_mapping.items():
            if label in labels:  # Make sure the label exists in our dataset
                for keyword in keywords:
                    if keyword in food_lower:
                        matches[label] = plasticizer_value
                        print(f"Match found: '{food_name}' ->{label} (value: {plasticizer_value})")
                        break
                if label in matches:
                    break
    
    return matches

def generate_api_mapping(matches):
 te the API mapping code
    api_code = "# Real plasticizer data from Nat Friedman's plastic list\n"
    api_code += plasticizer_map = {\n"
    
    for label, value in sorted(matches.items()):
        api_code += f" {label}: {int(value)},\n"
    
    api_code += "    # Default value for foods not in the dataset\n"
    api_code +=  default':0n"
    api_code += "}\n"
    
    return api_code

def main():
    print(Loading labels...")
    labels = load_labels()
    print(f"Loaded {len(labels)} labels")
    
    print("Loading plasticizer data...)  plasticizer_data = load_plasticizer_data()
    print(f"Loaded {len(plasticizer_data)} plasticizer entries")
    
    print("Finding matches...")
    matches = find_matches(labels, plasticizer_data)
    print(f"\nFound {len(matches)} matches")
    
    print("\nGenerating API mapping...")
    api_code = generate_api_mapping(matches)
    
    # Save the mapping
    with open('plasticizer_mapping.py', w) asf:
        f.write(api_code)
    
    print(f"\nMapping saved to plasticizer_mapping.py)   print(f"Matched {len(matches)} out of {len(labels)} labels)  
    # Show some examples
    print(nExample matches:")
    for i, (label, value) in enumerate(list(matches.items())[:10):
        print(f"  {label}: {int(value)} ng/serving)
    
    if len(matches) < len(labels):
        print(f"\nNote: {len(labels) - len(matches)} labels have no plasticizer data and will use default value)if __name__ == "__main__":
    main() 