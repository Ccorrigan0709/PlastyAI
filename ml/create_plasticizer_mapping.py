#!/usr/bin/env python3
"""
Script to create plasticizer mapping from the updated data file
"""

def create_plasticizer_mapping():
    """Create the plasticizer mapping from the data file"""
    
    plasticizer_map = {}
    
    # Read the plasticizer data file
    with open('Foods with plactisizers.txt', 'r') as f:
        lines = f.readlines()
    
    # Skip the header line
    for line in lines[1:]:
        line = line.strip()
        if line:
            # Split by tab character
            parts = line.split('\t')
            if len(parts) == 2:
                food_name = parts[0].strip()
                try:
                    plasticizer_value = int(parts[1].strip())
                    plasticizer_map[food_name] = plasticizer_value
                except ValueError:
                    print(f"Warning: Could not parse value for {food_name}")
    
    return plasticizer_map

def generate_api_mapping(plasticizer_map):
    """Generate the API mapping code"""
    
    api_code = "# Real plasticizer data from updated dataset\n"
    api_code += "# Values in nanograms per serving\n\n"
    api_code += "plasticizer_map = {\n"
    
    # Sort by food name for consistent output
    for food_name, value in sorted(plasticizer_map.items()):
        api_code += f"    '{food_name}': {value},\n"
    
    api_code += "    # Default value for foods not in the dataset\n"
    api_code += "    'default': 0\n"
    api_code += "}\n"
    
    return api_code

def main():
    print("Creating plasticizer mapping...")
    
    # Create the mapping
    plasticizer_map = create_plasticizer_mapping()
    
    print(f"Loaded {len(plasticizer_map)} food items with plasticizer data")
    
    # Generate the API mapping
    api_code = generate_api_mapping(plasticizer_map)
    
    # Save to file
    with open('plasticizer_mapping.py', 'w') as f:
        f.write(api_code)
    
    print("Mapping saved to plasticizer_mapping.py")
    
    # Show some examples
    print("\nExample mappings:")
    example_foods = ['apple_pie', 'hamburger', 'pizza', 'steak', 'macaroni_and_cheese']
    for food in example_foods:
        if food in plasticizer_map:
            print(f"  {food}: {plasticizer_map[food]} ng/serving")
        else:
            print(f"  {food}: Not found in dataset")

if __name__ == "__main__":
    main() 