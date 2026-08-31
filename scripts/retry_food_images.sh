#!/bin/bash
# Retry des images en rate-limit — séquentiel avec pauses
STYLE="professional editorial food photography, warm golden natural light, cream beige and caramel brown color palette, rustic light wood table, soft shadows, appetizing, shallow depth of field, michelin restaurant menu photography, high quality, detailed"
cd /home/z/my-project/public/food

declare -A IMGS=(
  ["poke-bowl"]="Poke bowl with grilled chicken, sushi rice, avocado, mango, edamame, carrots, sweet soy sauce drizzle, cream ceramic bowl"
  ["banh-mi"]="Vietnamese banh mi sandwich on fresh baguette with marinated chicken, pickled vegetables, fresh cilantro, wrapped in paper"
  ["traiteur-buffet"]="Elegant catering buffet table for event, assorted gourmet appetizers, mini burgers, spring rolls, salads on wooden platters, warm festive atmosphere"
  ["cafe-interior"]="Cozy warm cafe restaurant interior, wooden tables, caramel brown leather seats, pendant lights, cream walls, plants, inviting atmosphere, nobody"
)

for name in poke-bowl banh-mi traiteur-buffet cafe-interior; do
  if [ ! -s "${name}.png" ]; then
    size="1024x1024"
    [ "$name" = "traiteur-buffet" ] || [ "$name" = "cafe-interior" ] && size="1344x768"
    echo "--- Generating $name ($size) ---"
    z-ai image -p "${IMGS[$name]}, $STYLE" -o "${name}.png" -s $size
    sleep 8
  fi
done
ls -la
