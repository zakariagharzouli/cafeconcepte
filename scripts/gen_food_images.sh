#!/bin/bash
# Génération des visuels food Café Concept — tons chauds de la charte
mkdir -p /home/z/my-project/public/food

STYLE="professional editorial food photography, warm golden natural light, cream beige and caramel brown color palette, rustic light wood table, soft shadows, appetizing, shallow depth of field, michelin restaurant menu photography, high quality, detailed"

cd /home/z/my-project/public/food

z-ai image -p "Vietnamese bo bun noodle bowl with grilled chicken, rice vermicelli, fresh herbs, carrots, crispy spring rolls, peanuts, in a ceramic cream bowl, $STYLE" -o bo-bun.png -s 1024x1024 &
z-ai image -p "Gourmet smash burger with melted cheddar, caramelized onions, crispy bacon on brioche bun, golden crispy french fries, on ceramic plate, $STYLE" -o smash-burger.png -s 1024x1024 &
z-ai image -p "Poke bowl with grilled chicken, sushi rice, avocado, mango, edamame, carrots, sweet soy sauce drizzle, cream ceramic bowl, $STYLE" -o poke-bowl.png -s 1024x1024 &
z-ai image -p "Vietnamese banh mi sandwich on fresh baguette with marinated chicken, pickled vegetables, fresh cilantro, wrapped in paper, $STYLE" -o banh-mi.png -s 1024x1024 &
wait

z-ai image -p "Cambodian loc lac stir fried beef with caramelized sauce, tomato rice, fried egg, fresh salad, on ceramic plate, $STYLE" -o loclac.png -s 1024x1024 &
z-ai image -p "Cafe latte with beautiful rosetta latte art in ceramic cup, warm cozy cafe atmosphere, croissant on wooden board nearby, $STYLE" -o latte.png -s 1024x1024 &
z-ai image -p "Elegant catering buffet table for event, assorted gourmet appetizers, mini burgers, spring rolls, salads on wooden platters, warm festive atmosphere, $STYLE" -o traiteur-buffet.png -s 1344x768 &
z-ai image -p "Cozy warm cafe restaurant interior, wooden tables, caramel brown leather seats, pendant lights, cream walls, plants, inviting atmosphere, nobody, $STYLE" -o cafe-interior.png -s 1344x768 &
wait

ls -la
