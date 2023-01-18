#version 130

#define smooth_amnt $smooth_amount

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 delta = texture(iChannel2, uv) - texture(iChannel1, uv);
    float leng = length(delta) / 2.0;
    float amnt = max(pow(leng, smooth_amnt), (1.0 - smooth_amnt));
    fragColor = texture(iChannel2, uv) * (1.0 - amnt) + texture(iChannel1, uv) * amnt;
}
