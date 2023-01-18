 #version 130

const vec4 purple = vec4(198, 160, 246, 255);
const vec4 green = vec4(166, 218, 149, 255);
const vec4 blue = vec4(125, 196, 228, 255);
const vec4 orange = vec4(245, 169, 127, 255);
const vec4 red = vec4(237, 135, 150, 255);

const vec4 colors[] = vec4[](
    purple,
    green,
    blue,
    orange,
    orange,
    green,
    red,
    orange,
    purple,
    green,
    purple,
    orange,
    purple,
    red,
    orange,
    purple,
    orange,
    blue,
    orange,
    green,
    purple,
    blue,
    blue,
    orange
);

#define bs $bar_spacing
#define bw $bar_width

// From rbn42-bar
vec4 mean(float _from,float _to) {

    if(_from>1.0)
        return vec4(0);

    _from=iChannelResolution[1].x*_from;
    _to=iChannelResolution[1].x*_to;

    vec4 v=texelFetch(iChannel2, ivec2(_from,0),0) * (1.0-fract(_from)) ;

    for(float i=ceil(_from); i<floor(_to); i++)
        v+=texelFetch(iChannel2, ivec2(i,0),0) ;

    if(floor(_to)>floor(_from))
        v+=texelFetch(iChannel2,ivec2(_to,0),0)* fract(_to);
    else
        v-=texelFetch(iChannel2,ivec2(_to,0),0)*(1.0- fract(_to));

    return v/(_to-_from);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float bar_spacing = bs / iResolution.x;
    float bar_width = bw / iResolution.x;
    float total_spacing = bar_spacing + bar_width;
    vec2 uv = fragCoord / iResolution.xy;
    float xMod = mod(uv.x, total_spacing);
    if(xMod < bar_spacing || xMod > bar_width + bar_spacing) {
        fragColor = vec4(0);
        return;
    }
    uv.y -= 0.5;
    uv.y *= 2.0;
    uv.y = abs(uv.y);
    float floorX = floor(uv.x / total_spacing) * total_spacing;
    float height = mean(floorX, floorX + total_spacing).r;
    float radius = bar_width * (iResolution.x / iResolution.y);
    if(height != 0.0) height = max(height, radius);
    int colid = int(floor(uv.x / total_spacing)) % colors.length();
    if(uv.y + radius > height && uv.y < height) {
        // We want to be a circle, so we can get our distance from the center of the bar where the circle would be
        // If the distance is greater than the radius, we can be set to 0
        float yMod = uv.y - (height - radius);
        // We can turn this into x with some basic trig
        yMod /= radius;
        float x = sqrt(1.0 - pow(yMod, 2.0));
        x = 1.0 - x;
        x *= bar_width;
        float xMod = mod(uv.x, total_spacing);
        xMod -= bar_spacing;
        // Figure out if we are within the range we should be
        if(xMod < x / 2.0 || xMod > bar_width - x / 2.0) fragColor = vec4(0);
        else fragColor = colors[colid] / 255.0;
    }
    else if(height > uv.y) fragColor = colors[colid] / 255.0;
    else fragColor = vec4(0);
}
