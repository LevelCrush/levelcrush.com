import React from 'react';
import LFGFeed, { LFGActivity } from './components/LFGFeed';

export interface TestPageProps {
    lfgs: LFGActivity[];
}

export class TestPage extends React.Component<TestPageProps> {
    public constructor(props: TestPageProps) {
        super(props);
        console.log('Can this be seen');
        console.log(props);
    }

    public render() {
        return (
            <div>
                <h1>Test React Render</h1>
                <LFGFeed name="destiny-lfg" interval={3000} lfgs={this.props.lfgs}></LFGFeed>
            </div>
        );
    }
}
