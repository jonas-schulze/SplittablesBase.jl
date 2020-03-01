var documenterSearchIndex = {"docs":
[{"location":"#SplittablesBase.jl-1","page":"Home","title":"SplittablesBase.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"SplittablesBase\nSplittablesBase.halve\nSplittablesBase.Testing.test","category":"page"},{"location":"#SplittablesBase","page":"Home","title":"SplittablesBase","text":"SplittablesBase: a simple API for parallel computation on collections\n\n(Image: Dev) (Image: GitHub Actions)\n\nSplittablesBase.jl defines a simple API halve(collection) for splitting given collection roughly in half.  This is the basis of parallel algorithms like reduction and sorting.  Custom containers can support many parallel algorithms by simply defining a single function.\n\nSplittablesBase.jl also defines an experimental simple test utility function SplittablesBase.Testing.test(examples) where some automatable tests are run against each example container in examples.  This utility function is planned to be moved out to a separate package.\n\nSee more in the documentation.\n\nSupported collections\n\nhalve methods for following collections in Base are implemented in SplittablesBase.jl:\n\nAbstractArray\nAbstractString\nTuple\nNamedTuple\nzip\nIterators.partition\nIterators.product\nIterators.enumerate\n\nPackages using SplittablesBase.jl\n\nTransducers.jl (planned)\nThreadsX.jl (planned)\n\nSee also\n\nSpliterator<T> trySplit() (Java)\n\n\n\n\n\n","category":"module"},{"location":"#SplittablesBase.halve","page":"Home","title":"SplittablesBase.halve","text":"SplittablesBase.halve(collection) -> (left, right)\n\nSplit collection (roughly) in half.\n\nExamples\n\njulia> using SplittablesBase: halve\n\njulia> halve([1, 2, 3, 4])\n([1, 2], [3, 4])\n\nImplementation\n\nImplementations of halve on custom collections must satisfy the following laws.\n\n(1) If the original collection is ordered, concatenating the sub-collections returned by halve must create a collection that is equivalent to the original collection.  More precisely,\n\nisequal(\n    vec(collect(collection)),\n    vcat(vec(collect(left)), vec(collect(right))),\n)\n\nmust hold.\n\n(2) halve must shorten the collection.  More precisely, if length(collection) > 1, both length(left) < length(collection) and length(right) < length(collection) must hold.\n\nFurthermore, whenever implementable with cheap operations, length(left) should be close to length(collection) ÷ 2 as much as possible.\n\nLimitation\n\nhalve on zip of iterators with unequal lengths does not satisfy the \"vcat law\".\n\n\n\n\n\n","category":"function"},{"location":"#SplittablesBase.Testing.test","page":"Home","title":"SplittablesBase.Testing.test","text":"SplittablesBase.Testing.test(examples)\n\nRun interface tests on each test case in examples.\n\nexamples is an iterator where each element is either:\n\nA container to be tested.\nA NamedTuple with following keys\n:label: A label used for Test.@testcase.\n:data: A container to be tested.\n\nExamples\n\njulia> using SplittablesBase\n\njulia> SplittablesBase.Testing.test([\n           (label = \"First Test\", data = 1:5),\n           (label = \"Second Test\", data = (a = 1, b = 2, c = 3)),\n           zip(1:3, 4:6),\n       ]);\nTest Summary: | Pass  Total\nFirst Test    |    2      2\nTest Summary: | Pass  Total\nSecond Test   |    2      2\nTest Summary: | Pass  Total\n3             |    2      2\n\n\n\n\n\n","category":"function"}]
}
