"use strict";
class ApexDocGenerator {
    generateClassDoc(sym) {
        let body = [
            '@author',
            '@date',
            '@group',
            '@group-content',
            '@description'
        ];
        return this.generateComment(body);
    }
    generatePropertyComment(sym) {
        let body = [
            '@description'
        ];
        return this.generateComment(body);
    }
    generateConstructorDoc(sym) {
        let body = ['@description Constructor.'];
        this.generateParamsDoc(body, sym.attributes.params);
        return this.generateComment(body);
    }
    generateMethodDoc(sym) {
        let body = [`@description`];
        this.generateParamsDoc(body, sym.attributes.params);
        if (sym.type != 'void') {
            body.push(`@return`);
        }
        body.push('@example');
        return this.generateComment(body);
    }
    generateComment(body) {
        for (let i = 0; i < body.length; i++) {
            body[i] = ` ${ApexDocGenerator.COMMENT_BODY} ${body[i]}`;
        }
        body.unshift(`${ApexDocGenerator.COMMENT_START}`);
        body.push(` ${ApexDocGenerator.COMMENT_END}`);
        return body;
    }
    generateParamsDoc(body, params) {
        if (params) {
            params.forEach(param => {
                body.push(`@param ${param.name}`);
            });
        }
    }
}
ApexDocGenerator.COMMENT_START = '/**';
ApexDocGenerator.COMMENT_BODY = '*';
ApexDocGenerator.COMMENT_END = '*/';
exports.ApexDocGenerator = ApexDocGenerator;
class JavaDocGenerator extends ApexDocGenerator {
    generateClassDoc(sym) {
        let body = [
            '@author'
        ];
        return this.generateComment(body);
    }
    generatePropertyComment(sym) {
        let body = [
            ''
        ];
        return this.generateComment(body);
    }
    generateConstructorDoc(sym) {
        let body = ['Constructor.'];
        this.generateParamsDoc(body, sym.attributes.params);
        return this.generateComment(body);
    }
    generateMethodDoc(sym) {
        let body = [''];
        this.generateParamsDoc(body, sym.attributes.params);
        if (sym.type != 'void') {
            body.push(`@return`);
        }
        return this.generateComment(body);
    }
}
exports.JavaDocGenerator = JavaDocGenerator;
//# sourceMappingURL=apexDocGenerator.js.map