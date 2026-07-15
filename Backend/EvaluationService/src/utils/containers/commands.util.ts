const bashConfig = ['/bin/bash', '-c'];

export const commands = {
    python: function(code: string, input: string) {
        const base64Code = Buffer.from(code).toString('base64');
        const base64Input = Buffer.from(input).toString('base64');
        const runCommand = `echo '${base64Code}' | base64 -d > code.py && echo '${base64Input}' | base64 -d > input.txt && python3 code.py < input.txt`;
        return [...bashConfig, runCommand];
    },
    cpp: function(code: string, input: string) {
        const base64Code = Buffer.from(code).toString('base64');
        const base64Input = Buffer.from(input).toString('base64');
        const runCommand = `mkdir -p app && cd app && echo '${base64Code}' | base64 -d > code.cpp && echo '${base64Input}' | base64 -d > input.txt && g++ code.cpp -o run && ./run < input.txt`;
        return [...bashConfig, runCommand];
    }
}