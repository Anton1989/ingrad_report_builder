
export function calculateFloors(sections) {
    let min = sections[0].floors.length;
    let max = sections[0].floors.length;
    sections.forEach(section => {
        let floors = 0;
        section.floors.forEach(floor => {
            if (floor.type == 'general') {
                floors++;
            }
        });
        if (floors < min) {
            min = floors;
        }
        if (floors > max) {
            max = floors;
        }
    });
    return { min, max };
}

export function calculateAllFloors(sections) {
    let min = sections[0].floors.length;
    let max = sections[0].floors.length;
    sections.forEach(section => {
        if (section.floors.length < min) {
            min = section.floors.length;
        }
        if (section.floors.length > max) {
            max = section.floors.length;
        }
    });
    return { min, max };
}

export function getFloorNumbers(sections) {
    let floors = [];
    sections.forEach(section => {
        floors.push(...section.floors.map(floor => floor.number));
    });
    return floors.sort();
}